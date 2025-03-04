import { Router } from "express";
import {
  createAddressController,
  getAddressByUserIdController,
  updateAddressController,
} from "../controllers/address.controller";

const addressRoutes = Router();

addressRoutes.post("", createAddressController);
addressRoutes.patch("/:userId", updateAddressController);
addressRoutes.get("/:userId", getAddressByUserIdController);

export default addressRoutes;
