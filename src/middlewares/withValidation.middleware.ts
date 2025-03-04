import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { HTTPSTATUS } from "../config/http-status.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";

type ValidationSource = "body" | "params" | "query";

export function withValidation<T extends object>(
  DtoClass: new () => T,
  source: ValidationSource = "body"
) {
  return function (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dtoInstance = plainToInstance(DtoClass, req[source]);
        const errors = await validate(dtoInstance, { whitelist: true });
        if (errors.length > 0) {
          return formatValidationError(res, errors);
        }
        req.dto = dtoInstance;
        return handler(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
}

export const formatValidationError = (
  res: Response,
  errors: ValidationError[]
) => {
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    errors: errors.map((err) => ({
      field: err.property,
      message: err.constraints,
    })),
  });
};
