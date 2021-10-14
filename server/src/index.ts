import "./pre-start"; // Must be the first import
import logger from "@shared/Logger";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";

import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import passport from "passport";
import { StrategyOptions, ExtractJwt, Strategy } from "passport-jwt";
import baseRouter from "./routes";
import session from "express-session";

// Start the server

(async () => {
  const app = express();
  const prisma = new PrismaClient();

  const { BAD_REQUEST } = StatusCodes;

  /************************************************************************************
   *                              Set basic express settings
   ***********************************************************************************/

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  //Passport Init
  app.use(passport.initialize());
  app.use(
    session({
      secret: process.env.JWT_SECRET!,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(passport.session());

  // Prisma
  await prisma.$connect();

  // Show routes called in console during development
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Security
  if (process.env.NODE_ENV === "production") {
    app.use(helmet());
  }

  // Add APIs
  app.use("/api", baseRouter);

  // Add Static
  app.use("/static", express.static("static"));

  // Print API errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
      error: err.message,
    });
  });

  var opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Passport

  passport.use(
    new Strategy(opts, async function (payload, done) {
      try {
        const user = await prisma.user.findFirst({
          where: {
            id: payload.id,
          },
          include: {
            address: true,
          },
        });

        if (!user) return done(new Error("User not found!"));

        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

  const port = Number(process.env.PORT || 3000);

  app.listen(port, () => {
    logger.info("Express server started on port: " + port);
  });
})();
