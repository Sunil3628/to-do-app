// -------------------------------------------------------
// src/lib/mongodb.js
// -------------------------------------------------------
// This file creates and reuses a single MongoDB connection.
// In Next.js (especially in development), the server restarts
// often. Without caching, a new connection would be created
// on every request which is wasteful.
// -------------------------------------------------------

import mongoose from "mongoose";

// Read the connection string from the .env.local file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local file");
}

// We store the connection in a global variable so it survives
// hot reloads during development (Next.js re-imports modules often)
let cached = global.mongoose;

if (!cached) {
  // First time: initialize the cache object
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If we already have a connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If no ongoing connection attempt, start one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  // Wait for the connection and store it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
