import { jest } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";
const mockZoneCreate = jest.fn<any>();
const mockZoneFindAll = jest.fn<any>();
const mockZoneFindOne = jest.fn<any>();
jest.unstable_mockModule("../models/Zone.js", () => ({
    default: {
        create: mockZoneCreate,
        findAll: mockZoneFindAll,
        findOne: mockZoneFindOne,
    },
}));
const { createZone, getAllZones, getZoneById } = await import("../controllers/zoneControllers.js");

describe("Zone Controllers", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        req = {};
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson }));
        res = { status: mockStatus, json: mockJson } as any;
        next = jest.fn();
        jest.clearAllMocks();
    });
    test("✅ createZone successfully", async () => {
        req.body = { name: "Casablanca", centerLat: 33.5, centerLng: -7.6, radius: 10 };
        const mockZone = { id: 1, ...req.body };
        mockZoneCreate.mockResolvedValue(mockZone);

        await createZone(req as Request, res as Response, next);

        expect(mockZoneCreate).toHaveBeenCalledWith(req.body);
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({ success: true, data: mockZone });
    });
    test("❌ createZone fails if missing fields", async () => {
        req.body = { name: "Casablanca" };
        await createZone(req as Request, res as Response, next);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            success: false,
            message: "All fields are required: name, centerLat, centerLng, radius",
        });
    });
    test("✅ getAllZones returns all zones", async () => {
        const zones = [{ id: 1, name: "Casablanca" }, { id: 2, name: "Rabat" }];
        mockZoneFindAll.mockResolvedValue(zones);

        await getAllZones(req as Request, res as Response, next);

        expect(mockZoneFindAll).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ success: true, data: zones });
    });

    test("✅ getZoneById returns zone if exists", async () => {
        const mockZone = { id: 1, name: "Casablanca" };
        req.params = { id: "1" };
        mockZoneFindOne.mockResolvedValue(mockZone);

        await getZoneById(req as Request, res as Response, next);

        expect(mockZoneFindOne).toHaveBeenCalledWith({ where: { id: "1" } });
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ success: true, data: mockZone });
    });
    test("❌ getZoneById returns 404 if zone not found", async () => {
        req.params = { id: "99" };
        mockZoneFindOne.mockResolvedValue(null);

        await getZoneById(req as Request, res as Response, next);

        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({
            success: false,
            message: "Zone not found",
        });
    });
});
