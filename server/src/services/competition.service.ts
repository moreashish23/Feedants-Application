import { Competition, ICompetition } from '../models/Competition';
import { Registration } from '../models/Registration';
import { ApiError } from '../utils/ApiError';
import { deriveLifecycleState } from '../utils/competitionState';
import { LifecycleState, SubmissionStatus } from '../types';

export interface CompetitionDetailsResult {
  competition: Record<string, unknown>;
  availability: {
    capacity: number;
    registeredCount: number;
    remainingSpots: number;
  };
  lifecycle: {
    state: LifecycleState;
    registrationOpen: boolean;
    submissionOpen: boolean;
  };
  userState: {
    isRegistered: boolean;
    submissionStatus: SubmissionStatus;
    submissionUrl?: string;
  };
  serverTime: string;
}

function toPublicCompetition(competition: ICompetition): Record<string, unknown> {
  const obj = competition.toObject({ virtuals: false });
  delete obj.__v;
  delete obj.registeredCount;
  return obj;
}

export async function findCompetitionOrThrow(competitionId: string): Promise<ICompetition> {
  const competition = await Competition.findById(competitionId);
  if (!competition) {
    throw ApiError.notFound('COMPETITION_NOT_FOUND', 'This competition does not exist.');
  }
  return competition;
}

export async function getCompetitionDetails(
  competitionId: string,
  userId: string | undefined
): Promise<CompetitionDetailsResult> {
  const competition = await findCompetitionOrThrow(competitionId);
  const now = new Date();

  const lifecycle = deriveLifecycleState(
    {
      registrationStart: competition.registrationStart,
      registrationEnd: competition.registrationEnd,
      submissionStart: competition.submissionStart,
      submissionEnd: competition.submissionEnd,
      resultDate: competition.resultDate,
    },
    now
  );

  let userState: CompetitionDetailsResult['userState'] = {
    isRegistered: false,
    submissionStatus: 'NOT_SUBMITTED',
  };

  if (userId) {
    const registration = await Registration.findOne({
      competitionId: competition._id,
      userId,
      status: 'REGISTERED',
    }).lean();

    if (registration) {
      userState = {
        isRegistered: true,
        submissionStatus: registration.submissionStatus,
        submissionUrl: registration.submissionUrl,
      };
    }
  }

  return {
    competition: toPublicCompetition(competition),
    availability: {
      capacity: competition.capacity,
      registeredCount: competition.registeredCount,
      remainingSpots: Math.max(competition.capacity - competition.registeredCount, 0),
    },
    lifecycle,
    userState,
    serverTime: now.toISOString(),
  };
}

export async function getWinners(competitionId: string) {
  const competition = await findCompetitionOrThrow(competitionId);
  return {
    competitionId: competition._id.toString(),
    title: competition.title,
    resultDate: competition.resultDate,
    previousWinners: competition.previousWinners,
  };
}