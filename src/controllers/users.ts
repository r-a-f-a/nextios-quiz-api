import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/users';
import { Verification } from '../models/verification';
import { authMiddleware } from '../middlewares/auth';
import GeneratorService from '../services/generator';
import MailService from '../services/mail';
import fs from 'fs';
import path from 'path';
import { template } from '../templates/code';

@Controller('users')
@ClassMiddleware(authMiddleware)
export class UsersController {
    @Get('')
    public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = req.payload.filter ? req.payload.filter : {}
            const result = await User.find(filter);
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Post('')
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const exists = await User.findOne({ email: req.payload.email });
            if (exists) res.status(200).send({ code: 200, result: exists });

            const user = new User({ email: req.payload.email });
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

    @Post('verification/send')
    public async sendVerificationCode (req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const user = await User.findById(req.payload.userId);
        if (!user) {
          res.status(400).send({ code: 400, error: 'USER_NOT_FOUND' });
          return;
        }
        const userId = req.payload.userId;
        const code = GeneratorService.generateToken();
        const verificationCode = new Verification({ code, userId });
        const result = await verificationCode.save();
        if (!result) {
          res.status(500).send({ code: 500 });
          return;
        }
        const mail = new MailService();
        let html = template.replace(/\{code\}/gi, code);
        // console.log('TEMPLATE', template)
        const send = await mail.send({
          from: "comunicacaointerna@locaweb.com.br",
          to: user?.email,
          subject: "Quiz NEXTIOS: Código de verificação",
          html: html
        });
        console.log('SEND', send)
        res.status?.(201).send({ code: 201, result: 'VERIFICATION_CODE_SENDED' });
      } catch (error) {
        console.log('ERROR', error);
        res.status?.(500).send({ code: 500, error: error.message });
      }
    }

    @Get('verification/validate')
    public async validateVerificationCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await User.findById(req.payload.userId);
            if (!user) res.status(400).send({ code: 400, error: 'USER_NOT_FOUND' });
            const verification = await Verification.findOne({ userId: req.payload.userId, code: req.payload.code } );
            if (!verification) res.status(400).send({ code: 400, error: 'CODE_VALIDATION_DENIED' });
            const updated = await Verification.findByIdAndUpdate(verification?.id, { verificated: true });
            res.status(200).send({ code: 200, result: true });
        } catch (error) {
            console.log('ERROR', error);
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }
}