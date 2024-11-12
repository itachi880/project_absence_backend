const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
// Local MongoDB URI (default localhost and port)
const localUri = "mongodb://localhost:27017/";
const atlasUri = process.env.MONGODB_URL;

const databaseName = process.env.DB_NAME;

const localClient = new MongoClient(localUri, { useNewUrlParser: true, useUnifiedTopology: true });
const atlasClient = new MongoClient(atlasUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function migrateData() {
  try {
    await localClient.connect();
    await atlasClient.connect();

    const localDb = localClient.db(databaseName);
    const atlasDb = atlasClient.db(databaseName);

    const collections = await localDb.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;

      const data = await localDb.collection(collectionName).find().toArray();

      if (data.length > 0) {
        await atlasDb.collection(collectionName).insertMany(data);
        console.log(`Data migrated for collection: ${collectionName}`);
      } else {
        console.log(`No data found for collection: ${collectionName}`);
      }
    }
  } catch (error) {
    console.error("Error migrating data:", error);
  } finally {
    // Close both connections
    await localClient.close();
    await atlasClient.close();
  }
}

migrateData();
