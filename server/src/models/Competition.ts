import { Schema, model, Document, Types } from 'mongoose';

export interface IJudge {
  name: string;
  profession: string;
  experience: string;
  image: string;
  introVideoUrl?: string;
}

export interface IPreviousWinner {
  name: string;
  position: string;
  image: string;
  videoUrl?: string;
}

export interface IReward {
  position: string;
  title: string;
  amount: number;
}

export interface IReferral {
  code: string;
  link: string;
  rewardPerSignup: number;
}

export interface ICompetition extends Document {
  _id: Types.ObjectId;
  title: string;
  category: string;
  tags: string[];
  description: string;
  aboutLong?: string;
  prizePool: number;
  entryFee: number;
  capacity: number;
  registeredCount: number;

  registrationStart: Date;
  registrationEnd: Date;
  submissionStart: Date;
  submissionEnd: Date;
  resultDate: Date;

  certificateAvailable: boolean;

  judge: IJudge;
  previousWinners: IPreviousWinner[];
  rewards: IReward[];

  judgingParameters: string[];
  rules: string[];
  eligibility: string[];
  refundPolicy: string;
  paymentProvider: string;
  referral: IReferral;

  createdAt: Date;
  updatedAt: Date;
}

const judgeSchema = new Schema<IJudge>(
  {
    name: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    introVideoUrl: { type: String, trim: true },
  },
  { _id: false }
);

const previousWinnerSchema = new Schema<IPreviousWinner>(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    videoUrl: { type: String, trim: true },
  },
  { _id: false }
);

const rewardSchema = new Schema<IReward>(
  {
    position: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const referralSchema = new Schema<IReferral>(
  {
    code: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    rewardPerSignup: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const competitionSchema = new Schema<ICompetition>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    description: { type: String, required: true },
    aboutLong: { type: String },

    prizePool: { type: Number, required: true, min: 0 },
    entryFee: { type: Number, required: true, min: 0 },

    capacity: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, required: true, default: 0, min: 0 },

    registrationStart: { type: Date, required: true },
    registrationEnd: { type: Date, required: true },
    submissionStart: { type: Date, required: true },
    submissionEnd: { type: Date, required: true },
    resultDate: { type: Date, required: true },

    certificateAvailable: { type: Boolean, default: false },

    judge: { type: judgeSchema, required: true },
    previousWinners: { type: [previousWinnerSchema], default: [] },
    rewards: { type: [rewardSchema], default: [] },

    judgingParameters: { type: [String], default: [] },
    rules: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    refundPolicy: { type: String, default: '' },
    paymentProvider: { type: String, default: '' },
    referral: { type: referralSchema, required: true },
  },
  { timestamps: true }
);

competitionSchema.pre('validate', function (next) {
  if (this.registeredCount > this.capacity) {
    next(new Error('registeredCount cannot exceed capacity'));
    return;
  }
  next();
});

competitionSchema.index({ category: 1 });

export const Competition = model<ICompetition>('Competition', competitionSchema);