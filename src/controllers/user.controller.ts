import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { withValidation } from "../middlewares/withValidation.middleware";
import { CreateUserDTO, UserIdDTO } from "../database/dto/user.dto";
import { HTTPSTATUS } from "../config/http-status.config";
import {
  createUserService,
  getTotalUsersCountService,
  getUserByIdService,
  getUsersService,
} from "../services/user.service";

export const createUserController = asyncHandler(
  withValidation(
    CreateUserDTO,
    "body"
  )(async (req: Request, res: Response) => {
    const createUserDTO = req.dto as CreateUserDTO;
    const { user } = await createUserService(createUserDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      data: {
        user,
      },
    });
  })
);

export const getUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = {
      pageNumber: parseInt(req.query.pageNumber as string) || 0,
      pageSize: parseInt(req.query.pageSize as string) || 10,
    };
    const result = await getUsersService(pagination);

    return res.status(HTTPSTATUS.OK).json({
      message: "All users fetched successfully",
      ...result,
    });
  }
);

export const getTotalUsersCountController = asyncHandler(
  async (req: Request, res: Response) => {
    const { total } = await getTotalUsersCountService();

    return res.status(HTTPSTATUS.OK).json({
      message: "Total number of user fetched successfully",
      data: {
        total,
      },
    });
  }
);

export const getUserByIdController = asyncHandler(
  withValidation(
    UserIdDTO,
    "params"
  )(async (req: Request, res: Response) => {
    const userIdDTO = req.dto as UserIdDTO;
    const userId = parseInt(userIdDTO.id, 10);

    const user = await getUserByIdService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User detailed fetched successfully",
      data: {
        user,
      },
    });
  })
);
