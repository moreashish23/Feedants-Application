import { Competition } from '../models/Competition';
import { Registration, IRegistration } from '../models/Registration';
import { ApiError } from '../utils/ApiError';
import { deriveLifecycleState } from '../utils/competitionState';
import { findCompetitionOrThrow } from './competition.service';

export interface RegisterResult {
  registration: IRegistration;
  availability: {
    capacity: number;
    registeredCount: number;
    remainingSpots: number;
  };
}

export async function registerForCompetition(
  competitionId: string,
  userId: string
): Promise<RegisterResult> {
  const competition = await findCompetitionOrThrow(competitionId);

  const lifecycle = deriveLifecycleState({
    registrationStart: competition.registrationStart,
    registrationEnd: competition.registrationEnd,
    submissionStart: competition.submissionStart,
    submissionEnd: competition.submissionEnd,
    resultDate: competition.resultDate,
  });

  if (!lifecycle.registrationOpen) {
    throw ApiError.conflict(
      'REGISTRATION_NOT_OPEN',
      `Registration is not currently open (current state: ${lifecycle.state}).`
    );
  }


  const existing = await Registration.findOne({ competitionId: competition._id, userId }).lean();
  if (existing) {
    throw ApiError.conflict('ALREADY_REGISTERED', 'You are already registered for this competition.');
  }

  const reserved = await Competition.findOneAndUpdate(
    { _id: competition._id, $expr: { $lt: ['$registeredCount', '$capacity'] } },
    { $inc: { registeredCount: 1 } },
    { new: true }
  );

  if (!reserved) {
    throw ApiError.conflict('COMPETITION_FULL', 'No registration spots are available.');
  }

  try {
    const registration = await Registration.create({
      competitionId: competition._id,
      userId,
      status: 'REGISTERED',
      registeredAt: new Date(),
      submissionStatus: 'NOT_SUBMITTED',
    });

    return {
      registration,
      availability: {
        capacity: reserved.capacity,
        registeredCount: reserved.registeredCount,
        remainingSpots: Math.max(reserved.capacity - reserved.registeredCount, 0),
      },
    };
  } catch (err) {
    // Roll back the capacity reservation - the slot must not be lost.
    await Competition.updateOne({ _id: competition._id }, { $inc: { registeredCount: -1 } });

    const isDuplicateKey =
      typeof err === 'object' && err !== null && 'code' in err && (err as { code: unknown }).code === 11000;

    if (isDuplicateKey) {
      throw ApiError.conflict('ALREADY_REGISTERED', 'You are already registered for this competition.');
    }

    throw err;
  }
}