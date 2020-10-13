import mongoose, { Document, Model } from "mongoose";

export interface Hits {
  question: number;
  duration: number;
}

export interface Result {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  hits: Array<Hits>;
  mistakes: Array<Hits>;
  createdAt: Date;
  updatedAt: Date;
}

// const schemaHits = new mongoose.Schema(
//   {
//     question: { type: Number, required: false },
//     duration: { type: Number, required: false }
//   }
// );

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    // hits: { type: [schemaHits], required: false },
    // mistakes: { type: [schemaHits], required: false }
    hits: { type: Array, required: false },
    mistakes: { type: Array, required: false }
  },
  {
    timestamps: true,
    collection: 'results',
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