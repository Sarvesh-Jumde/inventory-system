import { MongoClient, Db } from "mongodb";

const uri = process.env.MongoDBConnectionString || "";
const dbName = process.env.DatabaseName || "inventory_db";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  if (!uri) {
    throw new Error(
      "MongoDB connection string is not defined in environment variables.",
    );
  }

  const client = new MongoClient(uri);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(dbName);

  return cachedDb;
}
