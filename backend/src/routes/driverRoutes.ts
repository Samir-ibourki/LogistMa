import { Router } from "express";
import type { Router as RouterType } from "express";
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  getAvailableDrivers,
  updateDriver,
  updateDriverStatus,
  deleteDriver,
} from "../controllers/driverControllers.js";

const router: RouterType = Router();

router.post("/", createDriver);
router.get("/", getAllDrivers);
router.get("/available", getAvailableDrivers);
router.get("/:id", getDriverById);
router.put("/:id", updateDriver);
router.patch("/:id/status", updateDriverStatus);
router.delete("/:id", deleteDriver);

export default router;
