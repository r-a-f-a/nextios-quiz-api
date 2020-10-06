import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { Event } from '../models/event';
import { authMiddleware } from '../middlewares/auth';

@Controller('events')
@ClassMiddleware(authMiddleware)
export class EventsController {
  @Post('')
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('PAYLOAD', req.payload);
      if (req.payload.type === 'QUESTION_STARTED' && req.payload.data) {
        if (req.payload.data.question > 1) {
          const lastEventIsValid = await Event.findOne({
            'userId': req.payload.userId,
            'type': 'QUESTION_STARTED',
            'data.question': req.payload.data?.question? - 1: Number
          }).sort({
            'data.question': 'desc',
            'createdAt': 'desc'
          });
          if (!lastEventIsValid) res.status(201).send({ code: 409, error: 'CONFLICT'}); 
        }
      }

      const newEvent = req.payload;
      const event = new Event(newEvent);
      const result = await event.save();
      res.status(201).send({ code: 201, result: result});
    } catch (error) {
      console.log('ERROR', error);
      res.status?.(401).send({ code: 401, error: error.message });
    }
  }
}