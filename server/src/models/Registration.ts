import { Schema, model, Document, Types } from 'mongoose';
import { RegistrationStatus, SubmissionStatus } from '../types';

export interface IRegistration extends Document {
  _id: Types.ObjectId;
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  status: RegistrationStatus;
  registeredAt: Date;
  submissionStatus: SubmissionStatus;
  submissionUrl?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'CANCELLED'],
      default: 'REGISTERED',
    },
    registeredAt: {
      type: Date,
      default: () => new Date(),
    },
    submissionStatus: {
      type: String,
      enum: ['NOT_SUBMITTED', 'SUBMITTED'],
      default: 'NOT_SUBMITTED',
    },
    submissionUrl: { type: String, trim: true },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

registrationSchema.index({ competitionId: 1 });

export const Registration = model<IRegistration>('Registration', registrationSchema);