import mongoose from 'mongoose';
import { env } from './env';
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

mongoose.set('strictQuery', true);

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('connected', () => {
    console.log('[database] MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[database] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[database] MongoDB disconnected');
  });

  await mongoose.connect(env.mongodbUri);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export function getDbState(): string {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] ?? 'unknown';
}