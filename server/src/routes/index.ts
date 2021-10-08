import { Router } from "express";
import userRouter from "./User";
import addressRouter from "./Address";
import productsRouter from "./Product";
import ratingsRouter from "./Rating";
import imageRouter from "./Image";

// Export the base-router
const baseRouter = Router();
baseRouter.use("/users", userRouter);
baseRouter.use("/address", addressRouter);
baseRouter.use("/products", productsRouter);
baseRouter.use("/images", imageRouter);
baseRouter.use("/ratings", ratingsRouter);
export default baseRouter;
