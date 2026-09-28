import { Competition, Lifecycle, LifecycleState, UserState } from '../types/competition';


export type ActionKind = 'register' | 'submit' | 'update-submission' | 'none';

export interface ActionConfig {
  kind: ActionKind;
  label: string;
  sublabel?: string;
  disabled: boolean;
}

export function getActionConfig(lifecycle: Lifecycle, userState: UserState): ActionConfig {
  const { state } = lifecycle;

  if (state === 'UPCOMING') {
    return { kind: 'none', label: 'Registration Opens Soon', disabled: true };
  }

  if (state === 'REGISTRATION_OPEN') {
    if (userState.isRegistered) {
      return { kind: 'none', label: 'Registered', sublabel: 'Submission opens soon', disabled: true };
    }
    return { kind: 'register', label: 'Register', disabled: false };
  }

  if (state === 'REGISTRATION_CLOSED') {
    if (userState.isRegistered) {
      return { kind: 'none', label: 'Registered', sublabel: 'Submission opens soon', disabled: true };
    }
    return { kind: 'none', label: 'Registration Closed', disabled: true };
  }

  if (state === 'SUBMISSION_OPEN') {
    if (!userState.isRegistered) {
      return { kind: 'none', label: 'Registration Closed', disabled: true };
    }
    if (userState.submissionStatus === 'SUBMITTED') {
      return { kind: 'update-submission', label: 'Update Submission', sublabel: 'Submitted', disabled: false };
    }
    return { kind: 'submit', label: 'Upload Submission', disabled: false };
  }

  if (state === 'SUBMISSION_CLOSED') {
    return { kind: 'none', label: 'Submission Closed', disabled: true };
  }

  return { kind: 'none', label: 'Results Declared', disabled: true };
}

export interface CountdownTarget {
  label: string;
  targetDate: string;
  show: boolean;
}

export function getCountdownTarget(competition: Competition, state: LifecycleState): CountdownTarget {
  switch (state) {
    case 'UPCOMING':
      return { label: 'Registration opens in', targetDate: competition.registrationStart, show: true };
    case 'REGISTRATION_OPEN':
      return { label: 'Registration closes in', targetDate: competition.registrationEnd, show: true };
    case 'REGISTRATION_CLOSED':
      return { label: 'Submission opens in', targetDate: competition.submissionStart, show: true };
    case 'SUBMISSION_OPEN':
      return { label: 'Submission closes in', targetDate: competition.submissionEnd, show: true };
    case 'SUBMISSION_CLOSED':
      return { label: 'Result declared in', targetDate: competition.resultDate, show: true };
    case 'RESULT_DECLARED':
    default:
      return { label: '', targetDate: competition.resultDate, show: false };
  }
}

export function lifecycleBadgeLabel(state: LifecycleState): string {
  switch (state) {
    case 'UPCOMING':
      return 'Upcoming';
    case 'REGISTRATION_OPEN':
      return 'Registration Open';
    case 'REGISTRATION_CLOSED':
      return 'Registration Closed';
    case 'SUBMISSION_OPEN':
      return 'Submission Open';
    case 'SUBMISSION_CLOSED':
      return 'Submission Closed';
    case 'RESULT_DECLARED':
      return 'Results Declared';
    default:
      return state;
  }
}