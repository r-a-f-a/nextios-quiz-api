import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { Question } from '@src/models/question';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('events')
@ClassMiddleware(authMiddleware)
export class QuestionController {
    @Post('')
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newQuestion = req.payload
            const question = new Question(newQuestion);
            const result = await question.save();
            res.status(201).send({ code: 201, result: result});
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }
}