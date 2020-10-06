import config from 'config';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface Data {
  question: number;
}

export interface DecodedPayload {
  email?: string,
  id?: string;
  status?: boolean;
  userId?: mongoose.Types.ObjectId;
  filter?: object;
  code?: string;
  data?: Data;
  type?: string;
}

export default class AuthService {
  public static generateToken(payload: object): string {
    return jwt.sign(payload, config.get('App.auth.key'));
  }

  public static decodeToken(token: string): DecodedPayload {
    return jwt.verify(token, config.get('App.auth.key')) as DecodedPayload;
  }
}