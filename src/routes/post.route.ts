import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getPostsByUserIdController,
} from "../controllers/post.controller";

const postRoutes = Router();

postRoutes.post("", createPostController);
postRoutes.get("", getPostsByUserIdController);
postRoutes.delete("/:id", deletePostController);

export default postRoutes;
