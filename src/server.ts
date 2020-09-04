import './utils/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import * as database from './database';

import { AuthController } from '@src/controllers/auth';
import { QuestionController } from '@src/controllers/questions';
import { SessionController } from '@src/controllers/sessions';
import { UsersController } from './controllers/users';

export class SetupServer extends Server {
    constructor (private port: Number = 3000) {
        super();
    }

    public async init(): Promise<void> {
        this.setupExpress();
        this.setupControllers();
        await this.databaseSetup();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
    }

    private setupControllers(): void {
        const authController = new AuthController();
        const questionController = new QuestionController();
        const sessionController = new SessionController();
        const usersController = new UsersController();

        this.addControllers([
            authController,
            questionController,
            sessionController,
            usersController
        ]);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`App listen on port: ${this.port}`);
        });
    }

    private async databaseSetup(): Promise<void> {
        await database.connect();
    }

    public async close(): Promise<void> {
        await database.close();
    }

    public getApp(): Application {
        return this.app;
    }
}