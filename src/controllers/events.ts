import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { Event } from '../models/event';
import { authMiddleware } from '../middlewares/auth';

@Controller('events')
@ClassMiddleware(authMiddleware)
export class EventsController {
  @Post('')
  public async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      console.log('PAYLOAD', req.payload);
      // if (req.payload.type === 'QUESTION_STARTED' && req.payload.data) {
      //   if (req.payload.data.question > 1) {
      //     const lastEventIsValid = await Event.findOne({
      //       'userId': req.payload.userId,
      //       'type': 'QUESTION_STARTED',
      //       'data.question': req.payload.data.question - 1
      //     }).sort({
      //       'data.question': 'desc',
      //       'createdAt': 'desc'
      //     });
      //     if (!lastEventIsValid) res.status(201).send({ code: 409, error: 'CONFLICT'}); 
      //   }
      // }

      const check = await Event.find({
        'userId': req.payload.userId,
        'type': req.payload.type,
        'data.question': req.payload.data?.question
      });

      if (check.length) {
        return res.status(200).send({ code: 200, result: check});
      }

      const newEvent = req.payload;
      const event = new Event(newEvent);
      const result = await event.save();
      return res.status(201).send({ code: 201, result: result});
    } catch (error) {
      console.log('ERROR', error);
      return res.status?.(401).send({ code: 401, error: error.message });
    }
  }
}