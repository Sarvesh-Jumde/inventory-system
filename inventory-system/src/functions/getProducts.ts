import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { connectToDatabase } from "../shared/mogodb";
import { Product } from "../models/Product";

export async function getProducts(req: HttpRequest): Promise<HttpResponseInit> {
  const db = await connectToDatabase();

  const products = await db.collection<Product>("products").find({}).toArray();

  return { status: 200, jsonBody: products };
}
app.http("getProducts", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getProducts,
});
