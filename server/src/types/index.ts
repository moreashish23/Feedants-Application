import { Request } from 'express';

export type LifecycleState =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'SUBMISSION_OPEN'
  | 'SUBMISSION_CLOSED'
  | 'RESULT_DECLARED';

export type RegistrationStatus = 'REGISTERED' | 'CANCELLED';

export type SubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED';

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface Judge {
  name: string;
  profession: string;
  experience: string;
  image: string;
  introVideoUrl?: string;
}

export interface PreviousWinner {
  name: string;
  position: string;
  image: string;
  videoUrl?: string;
}

export interface Reward {
  position: string;
  title: string;
  amount: number;
}

export interface ReferralInfo {
  code: string;
  link: string;
  rewardPerSignup: number;
}