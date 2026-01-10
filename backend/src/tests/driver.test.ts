import { jest } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

const mockDriverCreate = jest.fn() as any;
const mockDriverFindByPk = jest.fn() as any;
const mockDriverFindAll = jest.fn() as any;
const mockZoneFindByPk = jest.fn() as any;

jest.unstable_mockModule("../models/index.js", () => ({
    Driver: {
        create: mockDriverCreate,
        findByPk: mockDriverFindByPk,
        findAll: mockDriverFindAll,
    },
    Zone: {
        findByPk: mockZoneFindByPk,
    },
}));

const { createDriver } = await import("../controllers/driverControllers.js");

describe("createDriver", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        req = {};
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson })) as any;

        res = {
            status: mockStatus,
            json: mockJson,
        } as any;

        next = jest.fn() as NextFunction;
        jest.clearAllMocks();
    });

    test("✅ should create driver successfully with all fields", async () => {
        req.body = {
            name: "Youssef",
            phone: "0600000000",
            latitude: 33.5,
            longitude: -7.6,
            capacity: 10,
            status: "available",
            zoneId: 1,
        };

        const mockZone = { id: 1, name: "Casablanca" };
        const mockDriver = {
            id: 10,
            name: "Youssef",
            phone: "0600000000",
            latitude: 33.5,
            longitude: -7.6,
            capacity: 10,
            status: "available",
            zoneId: 1,
        };

        mockZoneFindByPk.mockResolvedValue(mockZone);
        mockDriverCreate.mockResolvedValue(mockDriver);

        await createDriver(req as Request, res as Response, next);

        expect(mockZoneFindByPk).toHaveBeenCalledWith(1);
        expect(mockDriverCreate).toHaveBeenCalledWith({
            name: "Youssef",
            phone: "0600000000",
            latitude: 33.5,
            longitude: -7.6,
            capacity: 10,
            status: "available",
            zoneId: 1,
        });
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            success: true,
            data: mockDriver,
        });
        expect(next).not.toHaveBeenCalled();
    });
});