import mongoose, { Document, Model } from "mongoose";

export interface Result {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  score: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    data: {
      question: { type: Object, required: false },
      response: { type: Object, required: false }
    }
  },
  {
    timestamps: true,
    collection: 'events',
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

interface ResultModel extends Omit<Result, '_id'>, Document {}

export const Result: Model<ResultModel> = mongoose.model('Result', schema);