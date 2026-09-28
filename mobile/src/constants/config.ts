function readEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

export const API_BASE_URL = readEnv('EXPO_PUBLIC_API_BASE_URL', 'http://localhost:5000').replace(
  /\/+$/,
  ''
);

export const COMPETITION_ID = readEnv('EXPO_PUBLIC_COMPETITION_ID', '');

export const SECURE_STORE_TOKEN_KEY = 'feedants_auth_token';
export const SECURE_STORE_USER_KEY = 'feedants_auth_user';