import type { Request, Response, NextFunction } from "express";
import Delivery from "../models/Delivery.js";
import Parcel from "../models/Parcel.js";
import Driver from "../models/Driver.js";

export const createDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { parcelId, driverId } = req.body;

    if (!parcelId || !driverId) {
      return res.status(400).json({
        success: false,
        message: "Required fields: parcelId, driverId",
      });
    }

    const parcel = await Parcel.findByPk(parcelId);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    if (parcel.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Parcel is not available for delivery",
      });
    }
    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (driver.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Driver is not available",
      });
    }

    const delivery = await Delivery.create({
      parcelId,
      driverId,
      status: "assigned",
      estimatedRoute: "",
      receiptGenerated: false,
      startedAt: new Date(),
      completedAt: null as any,
    });
    await parcel.update({ status: "assigned", driverId });
    await driver.update({ status: "busy" });

    return res.status(201).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDeliveries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, driverId } = req.query;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (driverId) whereClause.driverId = driverId;

    const deliveries = await Delivery.findAll({
      where: whereClause,
      include: [
        { model: Parcel, as: "parcel" },
        { model: Driver, as: "driver" },
      ],
    });

    return res.status(200).json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      include: [
        { model: Parcel, as: "parcel" },
        { model: Driver, as: "driver" },
      ],
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["assigned", "picked_up", "delivered", "failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const delivery = await Delivery.findByPk(id, {
      include: [
        { model: Parcel, as: "parcel" },
        { model: Driver, as: "driver" },
      ],
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    const updateData: any = { status };
    if (status === "delivered" || status === "failed") {
      updateData.completedAt = new Date();
    }
    await delivery.update(updateData);

    if (delivery.parcelId) {
      const parcelStatus =
        status === "delivered"
          ? "delivered"
          : status === "failed"
          ? "cancelled"
          : status;
      await (delivery.parcelId as any).update({ status: parcelStatus });
    }

    if ((status === "delivered" || status === "failed") && delivery.driverId) {
      await (delivery.driverId as any).update({ status: "available" });
    }

    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const getDriverDeliveries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { driverId } = req.params;

    const deliveries = await Delivery.findAll({
      where: { driverId },
      include: [{ model: Parcel, as: "parcel" }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    await delivery.destroy();

    return res.status(200).json({
      success: true,
      message: "Delivery deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
