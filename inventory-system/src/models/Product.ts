import { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  category: string;
  updatedAt: Date;
}
