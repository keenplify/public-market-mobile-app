import { Router } from 'express';
import userRouter from './User';

// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
export default baseRouter;
