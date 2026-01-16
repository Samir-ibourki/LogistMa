import { Router } from "express";
import { createZone, getAllZones, getZoneById, updateZone, deleteZone, } from "../controllers/zoneControllers.js";
const router = Router();
router.post("/", createZone);
router.get("/", getAllZones);
router.get("/:id", getZoneById);
router.put("/:id", updateZone);
router.delete("/:id", deleteZone);
export default router;
