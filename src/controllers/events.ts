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
            const newEvent = req.payload
            const event = new Event(newEvent);
            const result = await event.save();
            res.status(201).send({ code: 201, result: result});
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }
}