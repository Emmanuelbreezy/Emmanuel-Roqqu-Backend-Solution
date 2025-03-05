import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { withValidation } from "../middlewares/withValidation.middleware";
import { HTTPSTATUS } from "../config/http-status.config";
import { CreatePostDTO, PostIdDTO } from "../database/dto/post.dto";
import {
  createPostService,
  deletePostService,
  getPostsByUserIdService,
} from "../services/post.service";
import { BadRequestException } from "../utils/app-error";

export const getPostsByUserIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.query;

    const parsedUserId = userId ? parseInt(userId as string, 10) : undefined;
    const posts = await getPostsByUserIdService(parsedUserId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Posts fetched successfully",
      data: { posts },
    });
  }
);

export const createPostController = asyncHandler(
  withValidation(
    CreatePostDTO,
    "body"
  )(async (req: Request, res: Response) => {
    const createPostDTO = req.dto as CreatePostDTO;

    const post = await createPostService(createPostDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Post created successfully",
      data: { post },
    });
  })
);

export const deletePostController = asyncHandler(
  withValidation(
    PostIdDTO,
    "params"
  )(async (req: Request, res: Response) => {
    const postIdDTO = req.dto as PostIdDTO;

    const postId = parseInt(postIdDTO.id, 10);

    if (isNaN(postId)) {
      throw new BadRequestException("postId must be a valid number");
    }

    await deletePostService(postId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Post deleted successfully",
    });
  })
);
