import { Controller, Get, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { Event, EventModel } from '../models/event';
import { Result } from '../models/result';
import { authMiddleware } from '../middlewares/auth';
import { DateTime, Duration } from 'luxon';
import { Types } from 'mongoose';
import Questions from '../services/questions';
import { Question } from '@src/models/question';

@Controller('results')
@ClassMiddleware(authMiddleware)
export class ResultsController {
  @Get('')
  public async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const userId: Types.ObjectId = req.payload.userId!;

      const exists = await Result.findOne({ userId: userId });
      if (exists) {
        return res.status(201).send({ code: 200, result: exists });
      }

      const starts = await this.getQuizStarteds(userId);
      const answereds = await this.getQuizAnswereds(userId);

      if (starts.length && answereds.length) {
        return res.status(201).send({ code: 200, result: exists });
      }

      let hits: Array<object> = [];
      let mistakes: Array<object> = [];

      starts.forEach((start, index) => {
        const diff = this.getDurationQuestion(start.createdAt.toISOString(), answereds[index].createdAt.toISOString());
        const isHit = Questions().compare(answereds[index].data.question, JSON.stringify(answereds[index].data.response));
        let dataQuestion = { question: index + 1, duration: diff };
        if (isHit) {
          hits.push(dataQuestion);
        } else {
          mistakes.push(dataQuestion);
        }
      });

      let newData = { userId, hits, mistakes };

      let newResult = new Result(newData);
      const result = await newResult.save();

      return res.status(201).send({ code: 201, result: result });
    } catch (error) {
      console.log('ERROR', error);
      return res.status?.(401).send({ code: 401, error: error.message });
    }
  }

  private async getQuizStarteds(userId: Types.ObjectId): Promise<Array<EventModel>> {
    const starts: EventModel[] = await Event.find({ 'userId': userId, 'type': 'QUESTION_STARTED' });
    return starts;
  }

  private async getQuizAnswereds(userId: Types.ObjectId): Promise<Array<EventModel>>  {
    const answereds: EventModel[] = await Event.find({ 'userId': userId, 'type': 'QUESTION_ANSWERED' });
    return answereds;
  }

  private getDurationQuestion(start: string, end: string): number {
    const dateStart = DateTime.fromISO(start);
    const dateEnd = DateTime.fromISO(end);
    let diff = dateEnd.diff(dateStart, 'seconds').seconds;
    console.log('DIFF', diff);
    return diff;
  }
}