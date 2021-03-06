import { Controller, Get, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { Event } from '../models/event';
import { authMiddleware } from '../middlewares/auth';

@Controller('progress')
@ClassMiddleware(authMiddleware)
export class ProgressController {
  @Get('')
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await Event.findOne({
        'userId': req.payload.userId,
        'type': 'QUESTION_ANSWERED'
      }).sort({
        'data.question': 'desc',
        'createdAt': 'desc'
      });

      if (!result) {
        res.status(204).send({ code: 204, result: 'NO_CONTENT' });
      }

      res.status(201).send({ code: 200, result: result });
    } catch (error) {
      console.log('ERROR', error);
      res.status?.(401).send({ code: 401, error: error.message });
    }
  }
}