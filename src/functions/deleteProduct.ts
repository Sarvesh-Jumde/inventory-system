import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { connectToDatabase } from "../shared/mogodb";
import { ObjectId } from "mongodb";

export async function deleteProduct(
  req: HttpRequest,
): Promise<HttpResponseInit> {
  const id = req.query.get("id");
  if (!id || !ObjectId.isValid(id)) return { status: 400, body: "Invalid ID" };

  const db = await connectToDatabase();
  const result = await db
    .collection("products")
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount
    ? { status: 204 }
    : { status: 404, body: "Product not found" };
}

app.http("deleteProduct", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  handler: deleteProduct,
});
