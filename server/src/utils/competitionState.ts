import { LifecycleState } from '../types';

export interface CompetitionDates {
  registrationStart: Date;
  registrationEnd: Date;
  submissionStart: Date;
  submissionEnd: Date;
  resultDate: Date;
}

export interface LifecycleInfo {
  state: LifecycleState;
  registrationOpen: boolean;
  submissionOpen: boolean;
}

export function deriveLifecycleState(
  dates: CompetitionDates,
  now: Date = new Date()
): LifecycleInfo {
  const t = now.getTime();
  const { registrationStart, registrationEnd, submissionStart, submissionEnd, resultDate } = dates;

  let state: LifecycleState;

  if (t < registrationStart.getTime()) {
    state = 'UPCOMING';
  } else if (t < registrationEnd.getTime()) {
    state = 'REGISTRATION_OPEN';
  } else if (t < submissionStart.getTime()) {
    state = 'REGISTRATION_CLOSED';
  } else if (t < submissionEnd.getTime()) {
    state = 'SUBMISSION_OPEN';
  } else if (t < resultDate.getTime()) {
    state = 'SUBMISSION_CLOSED';
  } else {
    state = 'RESULT_DECLARED';
  }

  return {
    state,
    registrationOpen: state === 'REGISTRATION_OPEN',
    submissionOpen: state === 'SUBMISSION_OPEN',
  };
}