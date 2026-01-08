import { Router } from "express";
import type { Router as RouterType } from "express";
import {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
  getDriverDeliveries,
  deleteDelivery,
} from "../controllers/deliveryControllers.js";

const router: RouterType = Router();

router.post("/", createDelivery);
router.get("/", getAllDeliveries);
router.get("/driver/:driverId", getDriverDeliveries);
router.get("/:id", getDeliveryById);
router.patch("/:id/status", updateDeliveryStatus);
router.delete("/:id", deleteDelivery);

export default router;
