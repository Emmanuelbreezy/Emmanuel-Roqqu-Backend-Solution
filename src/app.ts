import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { ENV } from "./config/env.config";
import { HTTPSTATUS } from "./config/http-status.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import userRoutes from "./routes/user.route";
import addressRoutes from "./routes/address.route";
import postRoutes from "./routes/post.route";

export const createApp = () => {
  const app = express();
  const BASE_PATH = ENV.BASE_PATH;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: ENV.FRONTEND_ORIGIN,
      credentials: true,
    })
  );

  app.get(
    `/`,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      return res.status(HTTPSTATUS.OK).json({
        message: "Test api response",
      });
    })
  );

  app.use(`${BASE_PATH}/users`, userRoutes);
  app.use(`${BASE_PATH}/addresses`, addressRoutes);
  app.use(`${BASE_PATH}/posts`, postRoutes);

  // Error handler
  app.use(errorHandler);

  return app;
};
