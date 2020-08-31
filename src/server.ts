import express from 'express';
import { Application } from 'express';
import routes from './routes/routes'
import bodyParser from 'body-parser';
import * as database from './database';

export class Server {
    protected app: Application;
    private port: Number;

    constructor (port: Number = 3000) {
        this.port = port;
        this.app = express();
    }

    public async init (): Promise<void> {
        this.setup();
        await this.databaseSetup();
    }

    private setup (): void {
        this.app.use(routes);
        this.app.use(bodyParser.json());
    }

    public start (): void {
        this.app.listen(this.port, () => {
            console.log(`App listen on port: ${this.port}`);
        });
    }

    private async databaseSetup (): Promise<void> {
        await database.connect();
    }

    public async close(): Promise<void> {
        await database.close();
    }

    public getApp (): Application {
        return this.app;
    }
}