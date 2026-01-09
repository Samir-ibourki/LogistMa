import { Router } from "express";
import type { Router as RouterType } from "express";
import {
  createParcel,
  getAllParcels,
  getParcelById,
  getParcelByTrackingCode,
  updateParcel,
  updateParcelStatus,
  deleteParcel,
  dispatchParcel,
} from "../controllers/parcelControllers.js";

const router: RouterType = Router();

router.post("/", createParcel);
router.get("/", getAllParcels);
router.get("/track/:trackingCode", getParcelByTrackingCode);
router.get("/:id", getParcelById);
router.put("/:id", updateParcel);
router.patch("/:id/status", updateParcelStatus);
router.post("/:id/dispatch", dispatchParcel);
router.delete("/:id", deleteParcel);

export default router;
