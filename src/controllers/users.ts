import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { User } from '@src/models/users';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('users')
@ClassMiddleware(authMiddleware)
export class UsersController {
    @Get('')
    public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await User.find({});
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Post('')
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newUser = req.payload;
            const user = new User(newUser);
            const result = await user.save();
            res.status(201).send({ code: 201, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Get(':id')
    public async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await User.findById(req.params.id);
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Put(':id')
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = { _id: req.params.id }
            const update = req.payload
            const result = await User.findOneAndUpdate(filter, update);
            res.status(201).send({ code: 201, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Delete(':id')
    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = { _id: req.params.id }
            const result = await User.findOneAndDelete(filter)
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }
}