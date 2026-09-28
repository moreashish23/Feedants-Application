import { apiRequest } from './api';
import {
  CompetitionDetails,
  RegistrationResult,
  SubmissionResult,
  WinnersResponse,
} from '../types/competition';

export function getCompetitionDetails(
  competitionId: string,
  token: string | null,
  signal?: AbortSignal
): Promise<CompetitionDetails> {
  return apiRequest<CompetitionDetails>(`/api/competitions/${competitionId}`, { token, signal });
}

export function getCompetitionWinners(competitionId: string): Promise<WinnersResponse> {
  return apiRequest<WinnersResponse>(`/api/competitions/${competitionId}/winners`);
}

export function registerForCompetition(
  competitionId: string,
  token: string
): Promise<RegistrationResult> {
  return apiRequest<RegistrationResult>(`/api/competitions/${competitionId}/register`, {
    method: 'POST',
    token,
  });
}

export function submitForCompetition(
  competitionId: string,
  token: string,
  submissionUrl: string
): Promise<SubmissionResult> {
  return apiRequest<SubmissionResult>(`/api/competitions/${competitionId}/submission`, {
    method: 'POST',
    token,
    body: { submissionUrl },
  });
}