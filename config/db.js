const mongoose = require("mongoose");

const buildDirectMongoUri = (mongoUri) => {
  const url = new URL(mongoUri);

  if (url.host !== "cluster0.06zm19m.mongodb.net") {
    return null;
  }

  const databaseName = url.pathname && url.pathname !== "/" ? url.pathname : "/hackathon_ai";
  const username = encodeURIComponent(decodeURIComponent(url.username));
  const password = encodeURIComponent(decodeURIComponent(url.password));
  const auth = `${username}:${password}@`;
  const hosts = [
    "ac-mxuu5zr-shard-00-00.06zm19m.mongodb.net:27017",
    "ac-mxuu5zr-shard-00-01.06zm19m.mongodb.net:27017",
    "ac-mxuu5zr-shard-00-02.06zm19m.mongodb.net:27017",
  ].join(",");

  return `mongodb://${auth}${hosts}${databaseName}?tls=true&authSource=admin&replicaSet=atlas-kn2j98-shard-0&retryWrites=true&w=majority`;
};

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    const isSrvDnsError =
      process.env.MONGO_URI.startsWith("mongodb+srv://") &&
      error.message.includes("querySrv");

    if (!isSrvDnsError) {
      throw error;
    }

    const directUri = buildDirectMongoUri(process.env.MONGO_URI);

    if (!directUri) {
      throw error;
    }

    await mongoose.connect(directUri, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  console.log(`MongoDB connected successfully to ${mongoose.connection.name}`);
};

module.exports = connectDB;
