import { Registration, IRegistration } from '../models/Registration';
import { ApiError } from '../utils/ApiError';
import { deriveLifecycleState } from '../utils/competitionState';
import { findCompetitionOrThrow } from './competition.service';

export async function submitForCompetition(
  competitionId: string,
  userId: string,
  submissionUrl: string
): Promise<IRegistration> {
  const competition = await findCompetitionOrThrow(competitionId);

  const lifecycle = deriveLifecycleState({
    registrationStart: competition.registrationStart,
    registrationEnd: competition.registrationEnd,
    submissionStart: competition.submissionStart,
    submissionEnd: competition.submissionEnd,
    resultDate: competition.resultDate,
  });

  if (!lifecycle.submissionOpen) {
    throw ApiError.conflict(
      'SUBMISSION_NOT_OPEN',
      `Submissions are not currently open (current state: ${lifecycle.state}).`
    );
  }

  const registration = await Registration.findOne({
    competitionId: competition._id,
    userId,
    status: 'REGISTERED',
  });

  if (!registration) {
    throw ApiError.forbidden('NOT_REGISTERED', 'You must register for this competition before submitting.');
  }

  registration.submissionUrl = submissionUrl;
  registration.submissionStatus = 'SUBMITTED';
  registration.submittedAt = new Date();
  await registration.save();

  return registration;
}