import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getPostsByUserIdController,
} from "../controllers/post.controller";

const postRoutes = Router();

postRoutes.get("", getPostsByUserIdController);
postRoutes.post("", createPostController);
postRoutes.delete("/:id", deletePostController);

export default postRoutes;
