import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../types/config/config";


const uri = config.mongodbUri;
const client = new MongoClient(uri!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbConnection: Promise<void>;

export async function connectToMongoDB() {
  if (dbConnection) return dbConnection;

  dbConnection = client.connect().then(() => {
    console.log("Connected to MongoDB");
  });

  return dbConnection;
}

export async function disconnectFromMongoDB() {
  await client.close();
  console.log("Disconnected from MongoDB");
}
