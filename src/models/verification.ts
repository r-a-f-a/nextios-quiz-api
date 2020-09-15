import mongoose, { Document, Model, Collection } from 'mongoose';

export interface Verification {
  _id?: string;
  code: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  verificated: boolean;
}

const schema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    verificated: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: 'verifications',
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

interface VerificationModel extends Omit<Verification, '_id'>, Document {}

export const Verification: Model<VerificationModel> = mongoose.model('Verification', schema);