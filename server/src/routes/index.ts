import { Router } from "express";
import userRouter from "./User";
import addressRouter from "./Address";
import productsRouter from "./Product";
import ratingsRouter from "./Rating";
import imageRouter from "./Image";
import cartRouter from "./Cart";
import orderRouter from "./Order";
import messagesRouter from "./Messages";
import notificationsRouter from "./Notification";

// Export the base-router
const baseRouter = Router();
baseRouter.use("/users", userRouter);
baseRouter.use("/address", addressRouter);
baseRouter.use("/products", productsRouter);
baseRouter.use("/images", imageRouter);
baseRouter.use("/ratings", ratingsRouter);
baseRouter.use("/cartitems", cartRouter);
baseRouter.use("/orders", orderRouter);
baseRouter.use("/messages", messagesRouter);
baseRouter.use("/notifications", notificationsRouter);
export default baseRouter;
