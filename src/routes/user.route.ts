import { Router } from "express";
import {
  createUserController,
  getTotalUsersCountController,
  getUserByIdController,
  getUsersController,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("", createUserController);
userRoutes.get("", getUsersController);
userRoutes.get("/count", getTotalUsersCountController);
userRoutes.get("/:id", getUserByIdController);

export default userRoutes;
