import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  output,
} from "@azure/functions";
import { connectToDatabase } from "../shared/mogodb";
import { Product } from "../models/Product";
import { ObjectId } from "mongodb";

// The Queue Output binding for low stock alerts
const lowStockQueue = output.storageQueue({
  queueName: process.env.LowStockQueueName || "low-stock-alerts",
  connection: "AzureWebJobsStorage",
});

export async function updateStock(
  req: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const { id, quantity } = (await req.json()) as {
      id: string;
      quantity: number;
    };

    const db = await connectToDatabase();

    const updatedProduct = await db
      .collection<Product>("products")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { stockQuantity: quantity, updatedAt: new Date() } },
        { returnDocument: "after" },
      );

    if (!updatedProduct) return { status: 404, body: "Product not found" };

    // If stock is low, send a message to the queue for alerting

    if (updatedProduct.stockQuantity <= updatedProduct.lowStockThreshold) {
      context.log(
        `Low stock detected for ${updatedProduct.name}. Sending to queue...`,
      );

      // Push messge to the queue with product details
      context.extraOutputs.set(lowStockQueue, {
        productId: updatedProduct._id,
        productName: updatedProduct.name,
        currentStock: updatedProduct.stockQuantity,
        threshold: updatedProduct.lowStockThreshold,
      });
    }

    return { status: 200, jsonBody: updatedProduct };
  } catch (error) {
    context.error("Error updating stock:", error);
    return {
      status: 500,
      body: "Internal Server Error",
    };
  }
}

app.http("updateStock", {
  methods: ["PATCH"],
  authLevel: "anonymous",
  extraOutputs: [lowStockQueue],
  handler: updateStock,
});
