import Subscription from "../models/subscription.model.js";
import {
  cancelWorkflowRun,
  triggerSubscriptionWorkflow,
} from "../config/upstash.js";

// Only allow fields that the client is permitted to mutate directly.
const editableFields = [
  "name",
  "price",
  "currency",
  "frequency",
  "category",
  "paymentMethod",
  "status",
  "startDate",
  "renewalDate",
];

const getSubscriptionOrThrow = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");
    error.statusCode = 404;
    throw error;
  }

  return subscription;
};

const ensureOwnerOrAdmin = (subscription, user) => {
  if (subscription.user.toString() !== user.id && user.role !== "admin") {
    const error = new Error(
      "Access denied: You are not authorized to access this subscription",
    );
    error.statusCode = 403;
    throw error;
  }
};

// Every active subscription gets its own reminder workflow run.
// Persisting the returned workflowRunId lets us cancel/reschedule it later.
const scheduleReminderWorkflow = async (subscription) => {
  const { workflowRunId } = await triggerSubscriptionWorkflow(subscription.id);
  subscription.workflowRunId = workflowRunId;
  await subscription.save();
};

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    console.log("first", subscription.id);
    console.log("\nsecond", subscription._id);
    await scheduleReminderWorkflow(subscription);

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      const error = new Error(
        "Access denied: You are not authorized to view this user's subscriptions",
      );
      error.statusCode = 403;
      throw error;
    }
    const subscription = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await getSubscriptionOrThrow(req.params.id);
    ensureOwnerOrAdmin(subscription, req.user);
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await getSubscriptionOrThrow(req.params.id);
    ensureOwnerOrAdmin(subscription, req.user);
    const previousWorkflowRunId = subscription.workflowRunId;
    const previousRenewalDate = subscription.renewalDate?.getTime() ?? null;
    const previousStatus = subscription.status;

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        subscription[field] = req.body[field];
      }
    }

    await subscription.save();

    const currentRenewalDate = subscription.renewalDate?.getTime() ?? null;
    const renewalDateChanged = currentRenewalDate !== previousRenewalDate;
    const statusChanged = subscription.status !== previousStatus;

    // Renewal timing and status both affect when reminders should run.
    // If either changes, cancel the old workflow so we do not leave stale reminders behind.
    if ((renewalDateChanged || statusChanged) && previousWorkflowRunId) {
      await cancelWorkflowRun(previousWorkflowRunId);
      subscription.workflowRunId = undefined;
    }

    // Only active subscriptions should continue receiving reminders.
    if (
      (renewalDateChanged || statusChanged) &&
      subscription.status === "active"
    ) {
      await scheduleReminderWorkflow(subscription);
    } else if (
      (renewalDateChanged || statusChanged) &&
      subscription.workflowRunId !== undefined
    ) {
      await subscription.save();
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await getSubscriptionOrThrow(req.params.id);
    ensureOwnerOrAdmin(subscription, req.user);
    await cancelWorkflowRun(subscription.workflowRunId);

    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await getSubscriptionOrThrow(req.params.id);
    ensureOwnerOrAdmin(subscription, req.user);

    await cancelWorkflowRun(subscription.workflowRunId);
    subscription.status = "cancelled";
    subscription.workflowRunId = undefined;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const days = Number.parseInt(req.query.days, 10) || 30;

    if (days < 1) {
      const error = new Error("Days query parameter must be greater than 0");
      error.statusCode = 400;
      throw error;
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const query = {
      status: "active",
      renewalDate: {
        $gte: now,
        $lte: endDate,
      },
    };

    // Admins can inspect system-wide renewals, while normal users are scoped to their own records.
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    } else if (req.query.userId) {
      query.user = req.query.userId;
    }

    const subscriptions = await Subscription.find(query).sort({
      renewalDate: 1,
    });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};
