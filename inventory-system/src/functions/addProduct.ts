import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { connectToDatabase } from "../shared/mogodb";
import { Product } from "../models/Product";

export async function addProduct(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const body = (await request.json()) as Partial<Product>;

    // Simple Validation
    if (!body.name || !body.sku || body.price === undefined) {
      return { status: 400, body: "Missing required fields: name, sku, price" };
    }

    const db = await connectToDatabase();
    const collection = db.collection<Product>("products");

    const newProduct: Product = {
      name: body.name,
      sku: body.sku,
      price: body.price,
      stockQuantity: body.stockQuantity || 0,
      lowStockThreshold: body.lowStockThreshold || 5,
      category: body.category || "General",
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newProduct);

    return {
      status: 201,
      jsonBody: {
        id: result.insertedId,
        message: "Product created successfully",
      },
    };
  } catch (error) {
    context.error(`Error: ${error.message}`);
    return { status: 500, body: "Internal Server Error" };
  }
}

app.http("addProduct", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: addProduct,
});
