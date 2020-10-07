import { Controller, Get, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { Result } from '../models/result';
import { authMiddleware } from '../middlewares/auth';

@Controller('results')
@ClassMiddleware(authMiddleware)
export class ResultsController {
  @Get('')
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = {};
      res.status(201).send({ code: 200, result: result});
    } catch (error) {
      console.log('ERROR', error);
      res.status?.(401).send({ code: 401, error: error.message });
    }
  }
}