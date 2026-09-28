import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthUser } from '../types/competition';
import { getStoredToken, getStoredUser, loginAsDemoUser } from '../services/auth.service';

interface UseAuthResult {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  reauthenticate: () => Promise<string | null>;
}

export function useAuth(): UseAuthResult {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [storedToken, storedUser] = await Promise.all([getStoredToken(), getStoredUser()]);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        return;
      }
      const result = await loginAsDemoUser();
      setToken(result.token);
      setUser(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    void bootstrap();
  }, [bootstrap]);

  const reauthenticate = useCallback(async (): Promise<string | null> => {
    try {
      const result = await loginAsDemoUser();
      setToken(result.token);
      setUser(result.user);
      setError(null);
      return result.token;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      return null;
    }
  }, []);

  return { token, user, isLoading, error, reauthenticate };
}