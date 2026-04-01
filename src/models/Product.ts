import { z } from "zod";
import { ObjectId } from "mongodb";

// export interface Product {
//   _id?: ObjectId;
//   name: string;
//   sku: string;
//   price: number;
//   stockQuantity: number;
//   lowStockThreshold: number;
//   category: string;
//   updatedAt: Date;
// }

export const ProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  sku: z.string().toUpperCase(),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().default(5),
  category: z.string().optional().default("General"),
});

export const ProductDbSchema = ProductSchema.extend({
  _id: z.instanceof(ObjectId).optional(),
  updatedAt: z.date().default(() => new Date()),
});

// Types for use in functions
export type ProductInput = z.infer<typeof ProductSchema>;
export type Product = z.infer<typeof ProductDbSchema>;
