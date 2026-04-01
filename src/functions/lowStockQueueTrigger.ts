import { app, InvocationContext } from "@azure/functions";

export async function lowStockQueueTrigger(
  queueItem: any,
  context: InvocationContext,
): Promise<void> {
  // The 'queueItem' is the JSON object we sent from updateStock
  const { productName, currentStock, threshold } = queueItem;

  context.log(`[ALERT] Background processing for: ${productName} `);

  // Further enhancement could be to call an Email/SMS API to send an email or push notification to the inventory manager

  context.log(
    `NOTIFICATION SENT: ${productName} is low on stock (${currentStock} left).`,
  );
}

app.storageQueue("lowStockQueueTrigger", {
  queueName: process.env.LowStockQueueName || "low-stock-alerts",
  connection: "AzureWebJobsStorage",
  handler: lowStockQueueTrigger,
});
