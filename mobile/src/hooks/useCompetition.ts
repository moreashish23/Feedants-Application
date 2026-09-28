import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiRequestError } from '../services/api';
import {
  getCompetitionDetails,
  registerForCompetition,
  submitForCompetition,
} from '../services/competition.service';
import { CompetitionDetails } from '../types/competition';

interface UseCompetitionOptions {
  onUnauthorized?: () => Promise<string | null>;
}

interface UseCompetitionResult {
  data: CompetitionDetails | null;
  fetchedAtMs: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: ApiRequestError | null;
  notFound: boolean;
  refetch: () => Promise<void>;
  onPullToRefresh: () => Promise<void>;

  isRegistering: boolean;
  registerError: string | null;
  register: () => Promise<boolean>;

  isSubmitting: boolean;
  submitError: string | null;
  submit: (submissionUrl: string) => Promise<boolean>;
}

export function useCompetition(
  competitionId: string,
  token: string | null,
  options: UseCompetitionOptions = {}
): UseCompetitionResult {
  const { onUnauthorized } = options;

  const [data, setData] = useState<CompetitionDetails | null>(null);
  const [fetchedAtMs, setFetchedAtMs] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<ApiRequestError | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const tokenRef = useRef(token);
  tokenRef.current = token;

  const fetchDetails = useCallback(
    async (mode: 'initial' | 'silent' | 'pull') => {
      if (!competitionId) {
        setError(new ApiRequestError('No competition ID is configured.', 'CONFIG_ERROR', 0));
        setIsLoading(false);
        return;
      }

      if (mode === 'initial') setIsLoading(true);
      if (mode === 'pull') setIsRefreshing(true);
      setError(null);
      setNotFound(false);

      try {
        const result = await getCompetitionDetails(competitionId, tokenRef.current);
        setData(result);
        setFetchedAtMs(Date.now());
      } catch (err) {
        if (err instanceof ApiRequestError) {
          if (err.code === 'COMPETITION_NOT_FOUND' || err.status === 404) {
            setNotFound(true);
          } else {
            setError(err);
          }
        } else {
          setError(new ApiRequestError('Something went wrong.', 'UNKNOWN_ERROR', 0));
        }
      } finally {
        if (mode === 'initial') setIsLoading(false);
        if (mode === 'pull') setIsRefreshing(false);
      }
    },
    [competitionId]
  );

  useEffect(() => {
    void fetchDetails('initial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competitionId]);

  // Re-fetch (silently) whenever the auth token becomes available/changes,
  // so userState reflects the logged-in user as soon as demo auth resolves.
  const hasFetchedOnceRef = useRef(false);
  useEffect(() => {
    if (!hasFetchedOnceRef.current) {
      hasFetchedOnceRef.current = true;
      return;
    }
    void fetchDetails('silent');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const refetch = useCallback(() => fetchDetails('silent'), [fetchDetails]);
  const onPullToRefresh = useCallback(() => fetchDetails('pull'), [fetchDetails]);

  const register = useCallback(async (): Promise<boolean> => {
    if (isRegistering) return false; // prevent duplicate taps
    let activeToken = tokenRef.current;
    if (!activeToken) {
      setRegisterError('You need to be signed in to register.');
      return false;
    }

    setIsRegistering(true);
    setRegisterError(null);
    try {
      try {
        await registerForCompetition(competitionId, activeToken);
      } catch (err) {
        if (err instanceof ApiRequestError && err.status === 401 && onUnauthorized) {
          activeToken = await onUnauthorized();
          if (!activeToken) throw err;
          await registerForCompetition(competitionId, activeToken);
        } else {
          throw err;
        }
      }
      await fetchDetails('silent');
      return true;
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : 'Registration failed.');
      return false;
    } finally {
      setIsRegistering(false);
    }
  }, [competitionId, fetchDetails, isRegistering, onUnauthorized]);

  const submit = useCallback(
    async (submissionUrl: string): Promise<boolean> => {
      if (isSubmitting) return false;
      let activeToken = tokenRef.current;
      if (!activeToken) {
        setSubmitError('You need to be signed in to submit.');
        return false;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      try {
        try {
          await submitForCompetition(competitionId, activeToken, submissionUrl);
        } catch (err) {
          if (err instanceof ApiRequestError && err.status === 401 && onUnauthorized) {
            activeToken = await onUnauthorized();
            if (!activeToken) throw err;
            await submitForCompetition(competitionId, activeToken, submissionUrl);
          } else {
            throw err;
          }
        }
        await fetchDetails('silent');
        return true;
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [competitionId, fetchDetails, isSubmitting, onUnauthorized]
  );

  return {
    data,
    fetchedAtMs,
    isLoading,
    isRefreshing,
    error,
    notFound,
    refetch,
    onPullToRefresh,
    isRegistering,
    registerError,
    register,
    isSubmitting,
    submitError,
    submit,
  };
}