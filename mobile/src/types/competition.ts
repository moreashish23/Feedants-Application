export type LifecycleState =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'SUBMISSION_OPEN'
  | 'SUBMISSION_CLOSED'
  | 'RESULT_DECLARED';

export type SubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED';

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

export interface Referral {
  code: string;
  link: string;
  rewardPerSignup: number;
}

export interface Competition {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  aboutLong?: string;
  prizePool: number;
  entryFee: number;
  capacity: number;

  registrationStart: string;
  registrationEnd: string;
  submissionStart: string;
  submissionEnd: string;
  resultDate: string;

  certificateAvailable: boolean;

  judge: Judge;
  previousWinners: PreviousWinner[];
  rewards: Reward[];

  judgingParameters: string[];
  rules: string[];
  eligibility: string[];
  refundPolicy: string;
  paymentProvider: string;
  referral: Referral;

  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  capacity: number;
  registeredCount: number;
  remainingSpots: number;
}

export interface Lifecycle {
  state: LifecycleState;
  registrationOpen: boolean;
  submissionOpen: boolean;
}

export interface UserState {
  isRegistered: boolean;
  submissionStatus: SubmissionStatus;
  submissionUrl?: string;
}

export interface CompetitionDetails {
  competition: Competition;
  availability: Availability;
  lifecycle: Lifecycle;
  userState: UserState;
  serverTime: string;
}

export interface WinnersResponse {
  competitionId: string;
  title: string;
  resultDate: string;
  previousWinners: PreviousWinner[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DemoAuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegistrationResult {
  registration: {
    id: string;
    status: 'REGISTERED' | 'CANCELLED';
    registeredAt: string;
    submissionStatus: SubmissionStatus;
  };
  availability: Availability;
}

export interface SubmissionResult {
  submissionStatus: SubmissionStatus;
  submissionUrl?: string;
  submittedAt?: string;
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;