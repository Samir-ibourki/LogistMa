import type { Request, Response, NextFunction } from "express";
import Zone from "../models/Zone.js";

export const createZone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, centerLat, centerLng, radius } = req.body;

    if (!name || !centerLat || !centerLng || !radius) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, centerLat, centerLng, radius",
      });
    }

    const zone = await Zone.create({
      name,
      centerLat,
      centerLng,
      radius,
    });

    return res.status(201).json({
      success: true,
      data: zone,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllZones = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const zones = await Zone.findAll();
    return res.status(200).json({
      success: true,
      data: zones,
    });
  } catch (error) {
    next(error);
  }
};

export const getZoneById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const zone = await Zone.findOne({ where: { id } });

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: zone,
    });
  } catch (error) {
    next(error);
  }
};

export const updateZone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, centerLat, centerLng, radius } = req.body;

    const zone = await Zone.findByPk(id);

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    await zone.update({ name, centerLat, centerLng, radius });

    return res.status(200).json({
      success: true,
      data: zone,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteZone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const zone = await Zone.findByPk(id);

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    await zone.destroy();

    return res.status(200).json({
      success: true,
      message: "Zone deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
