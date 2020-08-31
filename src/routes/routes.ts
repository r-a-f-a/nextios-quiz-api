import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';

const routes = Router();

routes.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.send('Hello World');
});

export default routes;