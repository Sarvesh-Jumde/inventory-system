import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { connectToDatabase } from "../shared/mogodb";
import { Product } from "../models/Product";
import { ObjectId } from "mongodb";


export async function updateStock(req: HttpRequest): Promise<HttpResponseInit> {
  const { id, quantity } = (await req.json()) as {
    id: string;
    quantity: number;
  };

  const db = await connectToDatabase();
  const result = await db
    .collection("products")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { stockQuantity: quantity, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

  if (!result) return { status: 404, body: "Product not found" };

  // TODO: Step 3 will be adding logic here to push to Azure Queue if stock is low!
  return { status: 200, jsonBody: result };
}

app.http("updateStock", {
  methods: ["PATCH"],
  authLevel: "anonymous",
  handler: updateStock,
});
