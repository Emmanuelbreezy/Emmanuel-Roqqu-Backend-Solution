import { Request, Response } from "express";
import {
  CreateAddressDTO,
  UpdateAddressDTO,
  UserIdDTO,
} from "../database/dto/address.dto";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { withValidation } from "../middlewares/withValidation.middleware";
import { HTTPSTATUS } from "../config/http-status.config";
import {
  createAddressService,
  getAddressByUserIdService,
  updateAddressService,
} from "../services/address.service";
import { BadRequestException } from "../utils/app-error";

export const getAddressByUserIdController = asyncHandler(
  withValidation(
    UserIdDTO,
    "params"
  )(async (req: Request, res: Response) => {
    const userIdDTO = req.dto as UserIdDTO;
    const userId = parseInt(userIdDTO.userId, 10);

    const address = await getAddressByUserIdService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Address fetched successfully",
      data: { address },
    });
  })
);

export const createAddressController = asyncHandler(
  withValidation(
    CreateAddressDTO,
    "body"
  )(async (req: Request, res: Response) => {
    const createAddressDTO = req.dto as CreateAddressDTO;

    const address = await createAddressService(createAddressDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Address created successfully",
      data: { address },
    });
  })
);

export const updateAddressController = asyncHandler(
  withValidation(
    UpdateAddressDTO,
    "body"
  )(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      throw new BadRequestException("UserId is required");
    }
    const updateAddressDTO = req.dto as UpdateAddressDTO;
    const _userId = parseInt(userId, 10);

    if (isNaN(_userId)) {
      throw new BadRequestException("UserId must be a valid number");
    }

    const address = await updateAddressService(_userId, updateAddressDTO);

    return res.status(HTTPSTATUS.OK).json({
      message: "Address updated successfully",
      data: { address },
    });
  })
);
