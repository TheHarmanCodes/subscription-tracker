import { Client } from "@upstash/workflow";

import { QSTASH_TOKEN, QSTASH_URL, SERVER_URL } from "./env.js";

export const client = new Client({
  url: QSTASH_URL,
  token: QSTASH_TOKEN,
});

export const triggerSubscriptionWorkflow = async (subscriptionId) => {
  return await client.trigger({
    url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
    body: {
      subscriptionId,
    },
    headers: {
      "content-type": "application/json",
    },
    retries: 0,
  });
};

export const cancelWorkflowRun = async (workflowRunId) => {
  if (!workflowRunId) return;

  const cancelUrl = new URL(
    `/v2/workflows/runs/${workflowRunId}?cancel=true`,
    QSTASH_URL,
  );

  const response = await fetch(cancelUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${QSTASH_TOKEN}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(
      `Failed to cancel workflow run ${workflowRunId}: ${response.status} ${response.statusText}`,
    );
  }
};
