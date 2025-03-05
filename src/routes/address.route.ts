import { Router } from "express";
import {
  createAddressController,
  getAddressByUserIdController,
  updateAddressController,
} from "../controllers/address.controller";

const addressRoutes = Router();

addressRoutes.get("/:userId", getAddressByUserIdController);
addressRoutes.post("", createAddressController);
addressRoutes.patch("/:userId", updateAddressController);

export default addressRoutes;
