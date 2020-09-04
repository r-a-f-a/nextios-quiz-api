import { Controller, Get, Post, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { User } from '@src/models/users';
import mongoose from 'mongoose';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('auth')
@ClassMiddleware(authMiddleware)
export class AuthController {
    
}