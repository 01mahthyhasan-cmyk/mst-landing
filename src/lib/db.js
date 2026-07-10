import mongoose from 'mongoose';

// Global cache to survive Next.js hot-reload in dev
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

// Mongoose readyState values: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
const CONNECTED = 1;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('[db] MONGODB_URI environment variable is not set. Aborting.');
  }

  // If the cached connection is alive, reuse it
  if (cached.conn && mongoose.connection.readyState === CONNECTED) {
    return cached.conn;
  }

  // If the previous connection went stale (ECONNRESET, Atlas failover, idle timeout etc.)
  // clear the cache so we reconnect fresh instead of hanging for 60s on a dead socket.
  if (cached.conn && mongoose.connection.readyState !== CONNECTED) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Don't buffer ops — fail fast if connection isn't ready
      bufferCommands: false,

      // Atlas-friendly timeouts — fail in 10s instead of 30s default
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,

      // Required for Atlas replica sets
      retryWrites: true,
      w: 'majority',
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // On failure, clear the promise so the next call retries the connection
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}

