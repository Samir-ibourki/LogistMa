import type { Request, Response, NextFunction } from "express";
import Driver from "../models/Driver.js";
import Zone from "../models/Zone.js";

export const createDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, phone, latitude, longitude, capacity, status, zoneId } = req.body;

    if (!name || !phone || !latitude || !longitude || !zoneId) {
      return res.status(400).json({
        success: false,
        message: "Required fields: name, phone, latitude, longitude, zoneId",
      });
    }
    const zone = await Zone.findByPk(zoneId);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    const driver = await Driver.create({
      name,
      phone,
      latitude,
      longitude,
      capacity: capacity || 5,
      status: status || "offline",
      zoneId,
    });

    return res.status(201).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const drivers = await Driver.findAll({
      include: [{ model: Zone, as: "zone" }],
    });
    return res.status(200).json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
};

export const getDriverById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id, {
      include: [{ model: Zone, as: "zone" }],
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { zoneId } = req.query;

    const whereClause: any = { status: "available" };
    if (zoneId) {
      whereClause.zoneId = zoneId;
    }

    const drivers = await Driver.findAll({
      where: whereClause,
      include: [{ model: Zone, as: "zone" }],
    });

    return res.status(200).json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, phone, latitude, longitude, capacity, status, zoneId } = req.body;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    await driver.update({
      name,
      phone,
      latitude,
      longitude,
      capacity,
      status,
      zoneId,
    });

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDriverStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["available", "busy", "offline"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be: available, busy, or offline",
      });
    }

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    await driver.update({ status });

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    await driver.destroy();

    return res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
