import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { Parcel, Zone, Driver } from "../models/index.js";
import { DispatchService } from "../services/index.js";

export const createParcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      pickupAddress,
      pickupLat,
      pickupLng,
      deliveryAddress,
      deliveryLat,
      deliveryLng,
      weight,
      zoneId,
    } = req.body;

    if (!pickupAddress || !pickupLat || !pickupLng || !deliveryAddress || !deliveryLat || !deliveryLng || !zoneId) {
      return res.status(400).json({
        success: false,
        message: "Required fields: pickupAddress, pickupLat, pickupLng, deliveryAddress, deliveryLat, deliveryLng, zoneId",
      });
    }
    const zone = await Zone.findByPk(zoneId);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

   
    const trackingCode = `LM-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;

    const parcel = await Parcel.create({
      trackingCode,
      status: "pending",
      pickupAddress,
      pickupLat,
      pickupLng,
      deliveryAddress,
      deliveryLat,
      deliveryLng,
      weight: weight || 1,
      zoneId,
      driverId: null as any,
    });

    return res.status(201).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllParcels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, zoneId } = req.query;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (zoneId) whereClause.zoneId = zoneId;

    const parcels = await Parcel.findAll({
      where: whereClause,
      include: [
        { model: Zone },
        { model: Driver },
      ],
    });

    return res.status(200).json({
      success: true,
      data: parcels,
    });
  } catch (error) {
    next(error);
  }
};

export const getParcelById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const parcel = await Parcel.findByPk(id, {
      include: [
        { model: Zone },
        { model: Driver },
      ],
    });

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const getParcelByTrackingCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trackingCode } = req.params;

    const parcel = await Parcel.findOne({
      where: { trackingCode },
      include: [
        { model: Zone },
        { model: Driver },
      ],
    });

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const updateParcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const parcel = await Parcel.findByPk(id);

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    await parcel.update(updateData);

    return res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const updateParcelStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "assigned", "picked_up", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const parcel = await Parcel.findByPk(id);

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    await parcel.update({ status });

    return res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteParcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const parcel = await Parcel.findByPk(id);

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    await parcel.destroy();

    return res.status(200).json({
      success: true,
      message: "Parcel deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Dispatch a parcel to the best available driver
 * POST /api/parcels/:id/dispatch
 */
export const dispatchParcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Parcel ID is required",
      });
    }

    const result = await DispatchService.dispatchParcel(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        delivery: result.delivery,
        driver: {
          id: result.driver?.id,
          name: result.driver?.name,
          phone: result.driver?.phone,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
