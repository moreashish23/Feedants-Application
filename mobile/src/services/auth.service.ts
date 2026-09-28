import * as SecureStore from 'expo-secure-store';
import { apiRequest } from './api';
import { AuthUser, DemoAuthResponse } from '../types/competition';
import { SECURE_STORE_TOKEN_KEY, SECURE_STORE_USER_KEY } from '../constants/config';

export async function loginAsDemoUser(): Promise<DemoAuthResponse> {
  const result = await apiRequest<DemoAuthResponse>('/api/auth/demo', { method: 'POST' });
  await SecureStore.setItemAsync(SECURE_STORE_TOKEN_KEY, result.token);
  await SecureStore.setItemAsync(SECURE_STORE_USER_KEY, JSON.stringify(result.user));
  return result;
}

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const raw = await SecureStore.getItemAsync(SECURE_STORE_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function clearStoredAuth(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_STORE_TOKEN_KEY);
  await SecureStore.deleteItemAsync(SECURE_STORE_USER_KEY);
}