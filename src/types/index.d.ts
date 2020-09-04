import * as http from 'http';
import { DecodedPayload } from '../services/auth';

declare global {
  namespace Express {
    interface Request {
      payload: DecodedPayload;
    }
  }
}