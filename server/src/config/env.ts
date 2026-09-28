import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface EnvConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadEnv(): EnvConfig {
  const nodeEnv = (process.env.NODE_ENV as EnvConfig['nodeEnv']) || 'development';

  return {
    nodeEnv,
    port: Number(process.env.PORT) || 5000,
    mongodbUri: requireEnv('MONGODB_URI'),
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
}

export const env = loadEnv();