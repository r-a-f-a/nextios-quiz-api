import mongoose, { Document, Model, Collection } from 'mongoose';

export interface User {
  _id?: mongoose.Types.ObjectId;
  email: string;
  verificationCode: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true, default: true }
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

interface UserModel extends Omit<User, '_id'>, Document {}

export const User: Model<UserModel> = mongoose.model('User', schema);