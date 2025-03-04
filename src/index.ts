import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import { ENV } from "./config/env.config";
import { HTTPSTATUS } from "./config/http-status.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { initializeDatabase } from "./database/database";
import userRoutes from "./routes/user.route";

const app = express();
const BASE_PATH = ENV.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

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

app.use(errorHandler);

app.listen(ENV.PORT, async () => {
  await initializeDatabase();
  console.log(`Server listening on port ${ENV.PORT} in ${ENV.NODE_ENV}`);
});
