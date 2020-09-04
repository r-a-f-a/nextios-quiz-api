import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import { Session } from '@src/models/sessions';
import GeneratorService from '@src/services/generator';

@Controller('sessions')
@ClassMiddleware(authMiddleware)
export class SessionController {
    // @Get('')
    // public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const filter = req.payload.filter ? req.payload.filter : {};
    //         const result = await Session.find(filter);
    //         res.status(200).send({ code: 200, result: result});
    //     } catch (error) {
    //         res.status?.(401).send({ code: 401, error: error.message });
    //     }
    // }

    @Get(':userId')
    public async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await Session.findOne({ userId: req.params.userId });
            res.status(200).send({ code: 200, result: result});
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Post('')
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newSession = {
                verificationCode: GeneratorService.generateToken(),
                userId: req.payload.userId
            }
            const session = new Session(newSession);
            const result = await session.save();
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
            const result = await Session.findOneAndUpdate(filter, update);
            res.status(201).send({ code: 201, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Delete(':id')
    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = { _id: req.params.id }
            const result = await Session.findOneAndDelete(filter)
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }
}