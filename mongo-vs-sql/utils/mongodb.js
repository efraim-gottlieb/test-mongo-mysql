import { MongoClient } from "mongodb";

const MONGO_URL =
  "mongodb://admin:password123@localhost:27018/products?authSource=admin";
const DB_NAME = "products";
const COLLECTION_NAME = "products";

let mongocClient = null;
let mongoConn = null;

export async function initMongoDb() {
  try {
    mongocClient = new MongoClient(MONGO_URL);
    await mongocClient.connect();
    mongoConn = mongocClient.db(DB_NAME);

    const productsCollection = mongoConn.collection(COLLECTION_NAME);
    await productsCollection.createIndex({ name: 1 }, { unique: true });
    await mongocClient.close();
    mongoConn=null;
    mongocClient=null
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export async function getMongoDbConnection() {
  if (!mongoConn) {
    if (!mongocClient) {
      mongocClient = new MongoClient(MONGO_URL);
    }
    await mongocClient.connect();
    mongoConn = mongocClient.db(DB_NAME);
  }
  return mongoConn;
}
