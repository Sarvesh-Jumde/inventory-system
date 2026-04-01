import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { connectToDatabase } from "../shared/mogodb";
import {
  Product,
  ProductSchema,
  ProductInput,
  ProductDbSchema,
} from "../models/Product";

export async function addProduct(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const body = await request.json();

    // valiadte the body using zod schema
    const validation = ProductSchema.safeParse(body);

    // If validation fails, return 400 with error message
    if (!validation.success) {
      return {
        status: 400,
        jsonBody: {
          error: "Validation Failed",
          details: validation.error.format(),
        },
      };
    }

    // Extract the validated data
    const ValidatedData = validation.data;

    const db = await connectToDatabase();
    const collection = db.collection<Product>("products");

    const newProduct: Product = {
      ...ValidatedData,
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
