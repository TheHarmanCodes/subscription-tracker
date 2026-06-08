import { serve } from "@upstash/workflow/express";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-email.js";

// These offsets define the reminder schedule relative to the subscription renewal date.
const REMINDER = [7, 5, 2, 1];

export const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription: ${subscriptionId}. Stopping workflow`,
    );
    return;
  }

  for (const daysBefore of REMINDER) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    const reminderLabel = `${daysBefore} days before reminder`;

    if (reminderDate.isAfter(dayjs())) {
      // Workflow runs can sleep for long periods, so re-check the subscription
      // after waking up in case the user cancelled or changed it meanwhile.
      await sleepUntilReminder(context, reminderLabel, reminderDate);
      const currentSubscription = await fetchSubscription(
        context,
        subscriptionId,
      );
      if (!currentSubscription || currentSubscription.status !== "active") {
        console.log(
          `Subscription ${subscriptionId} is no longer active. Stopping workflow.`,
        );
        return;
      }
      await triggerReminder(context, reminderLabel, currentSubscription);
    } else if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(context, reminderLabel, subscription);
    }
    // This keeps the workflow deterministic:
    // future reminders sleep, same-day reminders send immediately, and past reminders are skipped.
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping for ${label} until ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering reminder for ${label}`);
    // The email layer expects a populated user so the workflow fetches the subscription with user details.
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};
