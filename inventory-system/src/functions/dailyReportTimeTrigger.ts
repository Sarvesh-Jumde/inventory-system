import { app, InvocationContext, Timer } from "@azure/functions";
import { connectToDatabase } from "../shared/mogodb";
import { Product } from "../models/Product";

export async function dailyReportTimeTrigger(
  myTimer: Timer,
  context: InvocationContext,
): Promise<void> {
  context.log("Timer trigger function executed for daily stock report.");

  try {
    const db = await connectToDatabase();
    // Find all products where stock is <= threshold
    // using the MongoDB $expr to compare two fields in the same document
    const lowStockItems = await db
      .collection<Product>("products")
      .find({
        $expr: { $lte: ["$stockQuantity", "$lowStockThreshold"] },
      })
      .toArray();

    if (lowStockItems.length === 0) {
      context.log("No low stock items found in the daily report.");
      return;
    }

    context.log(`Daily Report: Found ${lowStockItems.length} low stock items.`);

    lowStockItems.forEach((item) => {
      context.log(
        `- [LOW STOCK] ${item.name} (SKU: ${item.sku}): ${item.stockQuantity} remaining.`,
      );
    });

    // TODO generate a CSV of report
  } catch (error) {
    context.error("Error generating daily report:", error);
  }
}

app.timer("dailyReport", {
  schedule: "0 */1 * * * *", // For testing purposes 1 minute cron
  handler: dailyReportTimeTrigger,
});
