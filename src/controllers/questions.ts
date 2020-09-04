import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { Question } from '@src/models/question';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('questions')
@ClassMiddleware(authMiddleware)
export class QuestionController {
    @Get('')
    public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = req.payload.filter ? req.payload.filter : {};
            const result = await Question.find(filter);
            res.status(200).send({ code: 200, result: result});
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Get(':id')
    public async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await Question.findById(req.params.id);
            res.status(200).send({ code: 200, result: result});
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

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

    @Put(':id')
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = { _id: req.params.id }
            const update = req.payload
            const result = await Question.findOneAndUpdate(filter, update);
            res.status(201).send({ code: 201, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Delete(':id')
    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = { _id: req.params.id }
            const result = await Question.findOneAndDelete(filter)
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }
}