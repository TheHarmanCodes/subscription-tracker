import { Router } from "express";
import { authorize, requireAdmin } from "../middlewares/auth.middleware.js";
import {
  cancelSubscription,
  getUserSubscriptions,
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  getUpcomingRenewals,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Create a new subscription for the currently authenticated user.
subscriptionRouter.post("/", authorize, createSubscription);

// Fetch all subscriptions that belong to a specific user; admins can inspect any user.
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

// List active renewals in an upcoming time window for the current user or, for admins, the whole system.
subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);

// Cancel an existing subscription and stop its scheduled reminder workflow.
subscriptionRouter.patch("/:id/cancel", authorize, cancelSubscription);

// Fetch every subscription in the system; reserved for admin-level dashboard access.
subscriptionRouter.get("/", authorize, requireAdmin, getSubscriptions);

// Fetch one subscription by id; accessible to its owner or an admin.
subscriptionRouter.get("/:id", authorize, getSubscription);

// Update a subscription owned by the current user or managed by an admin.
subscriptionRouter.put("/:id", authorize, updateSubscription);

// Delete a subscription and clean up any reminder workflow tied to it.
subscriptionRouter.delete("/:id", authorize, deleteSubscription);

export default subscriptionRouter;
