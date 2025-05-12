import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb://localhost:27017";
const DB_NAME = "rahooQuizDB";

const options = {};

let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return { client, db };
}
