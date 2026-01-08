import { Router } from "express";
import type { Router as RouterType } from "express";
import zoneRoutes from "./zoneRoutes.js";
import driverRoutes from "./driverRoutes.js";
import parcelRoutes from "./parcelRoutes.js";
import deliveryRoutes from "./deliveryRoutes.js";

const router: RouterType = Router();

router.use("/zones", zoneRoutes);
router.use("/drivers", driverRoutes);
router.use("/parcels", parcelRoutes);
router.use("/deliveries", deliveryRoutes);

export default router;
