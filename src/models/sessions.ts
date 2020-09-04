import mongoose, { Document, Model, Collection } from 'mongoose';

export interface Session {
  _id?: string;
  verificationCode: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

const schema = new mongoose.Schema(
  {
    verificationCode: { type: Number, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'users'},
    status: { type: Boolean, required: true, default: true }
  },
  {
    timestamps: true,
    collection: 'sessions',
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

interface SessionModel extends Omit<Session, '_id'>, Document {}

export const Session: Model<SessionModel> = mongoose.model('Session', schema);