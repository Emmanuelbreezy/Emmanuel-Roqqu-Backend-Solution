import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";

type AyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (controller: AyncControllerType): AyncControllerType =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message,
          errorCode: error.errorCode,
        });
      }
      next(error);
    }
  };
