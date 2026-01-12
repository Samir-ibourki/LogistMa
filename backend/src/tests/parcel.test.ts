import { jest } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

const mockParcelCreate = jest.fn() as any;
const mockParcelFindByPk = jest.fn() as any;
const mockParcelFindAll = jest.fn() as any;
const mockZoneFindByPk = jest.fn() as any;

jest.unstable_mockModule("../models/index.js", () => ({
    Parcel: {
        create: mockParcelCreate,
        findByPk: mockParcelFindByPk,
        findAll: mockParcelFindAll,
    },
    Zone: {
        findByPk: mockZoneFindByPk,
    },
    Driver: {},
    Delivery: {},
}));

const { createParcel, getAllParcels, getParcelById } = await import("../controllers/parcelControllers.js");

describe("Parcel Controllers", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let mockJson: jest.MockedFunction<(body: any) => void>;
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

    afterAll(async () => {
        const { redisConnection, redisCache } = await import("../config/redis.js");
        await redisConnection.quit();
        await redisCache.quit();
    });
    describe("createParcel", () => {
        test("✅ createParcel should create parcel successfully", async () => {
            req.body = {
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                weight: 5,
                zoneId: 1,
            };
            const mockZone = { id: 1, name: "Casablanca" };
            const mockParcel = {
                id: 1,
                trackingCode: "LM-ABC123-XY45",
                status: "pending",
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                weight: 5,
                zoneId: 1,
                driverId: null,
            };
            mockZoneFindByPk.mockResolvedValue(mockZone);
            mockParcelCreate.mockResolvedValue(mockParcel);
            await createParcel(req as Request, res as Response, next);
            expect(mockZoneFindByPk).toHaveBeenCalledWith(1);
            expect(mockParcelCreate).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockParcel,
            });
        });
        test("✅ createParcel should use default weight of 1 when not provided", async () => {
            req.body = {
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                zoneId: 1,
            };
            const mockZone = { id: 1, name: "Casablanca" };
            const mockParcel = {
                id: 1,
                trackingCode: "LM-ABC123-XY45",
                status: "pending",
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                weight: 1,
                zoneId: 1,
                driverId: null,
            };
            mockZoneFindByPk.mockResolvedValue(mockZone);
            mockParcelCreate.mockResolvedValue(mockParcel);
            await createParcel(req as Request, res as Response, next);
            const createCall = mockParcelCreate.mock.calls[0][0];
            expect(createCall.weight).toBe(1);
            expect(mockStatus).toHaveBeenCalledWith(201);
        });
        test("❌ createParcel should fail when missing pickupAddress", async () => {
            req.body = {
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                zoneId: 1,
            };

            await createParcel(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Required fields: pickupAddress, pickupLat, pickupLng, deliveryAddress, deliveryLat, deliveryLng, zoneId",
            });
        });

        test("❌ createParcel should fail when missing pickupLat", async () => {
            req.body = {
                pickupAddress: "123 Main St, Casablanca",
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                zoneId: 1,
            };

            await createParcel(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Required fields: pickupAddress, pickupLat, pickupLng, deliveryAddress, deliveryLat, deliveryLng, zoneId",
            });
        });

        test("❌ createParcel should fail when missing deliveryAddress", async () => {
            req.body = {
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                zoneId: 1,
            };

            await createParcel(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Required fields: pickupAddress, pickupLat, pickupLng, deliveryAddress, deliveryLat, deliveryLng, zoneId",
            });
        });

        test("❌ createParcel should fail when missing zoneId", async () => {
            req.body = {
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
            };

            await createParcel(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Required fields: pickupAddress, pickupLat, pickupLng, deliveryAddress, deliveryLat, deliveryLng, zoneId",
            });
        });

        test("❌ createParcel should fail when zone not found", async () => {
            req.body = {
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                zoneId: 999,
            };

            mockZoneFindByPk.mockResolvedValue(null);

            await createParcel(req as Request, res as Response, next);

            expect(mockZoneFindByPk).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Zone not found",
            });
        });

        test("❌ createParcel should call next with error on exception", async () => {
            req.body = {
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                zoneId: 1,
            };

            const mockError = new Error("Database error");
            mockZoneFindByPk.mockRejectedValue(mockError);

            await createParcel(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe("getAllParcels", () => {
        test("✅ getAllParcels should return all parcels without filters", async () => {
            req.query = {};

            const mockParcels = [
                {
                    id: 1,
                    trackingCode: "LM-ABC123-XY45",
                    status: "pending",
                    zoneId: 1,
                    Zone: { id: 1, name: "Casablanca" },
                    Driver: null,
                },
                {
                    id: 2,
                    trackingCode: "LM-DEF456-ZW78",
                    status: "delivered",
                    zoneId: 2,
                    Zone: { id: 2, name: "Rabat" },
                    Driver: { id: 1, name: "Ahmed" },
                },
            ];

            mockParcelFindAll.mockResolvedValue(mockParcels);

            await getAllParcels(req as Request, res as Response, next);

            expect(mockParcelFindAll).toHaveBeenCalledWith({
                where: {},
                include: expect.any(Array),
            });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockParcels,
            });
        });

        test("✅ getAllParcels should filter by status", async () => {
            req.query = { status: "pending" };

            const mockParcels = [
                {
                    id: 1,
                    trackingCode: "LM-ABC123-XY45",
                    status: "pending",
                    zoneId: 1,
                    Zone: { id: 1, name: "Casablanca" },
                    Driver: null,
                },
            ];

            mockParcelFindAll.mockResolvedValue(mockParcels);

            await getAllParcels(req as Request, res as Response, next);

            expect(mockParcelFindAll).toHaveBeenCalledWith({
                where: { status: "pending" },
                include: expect.any(Array),
            });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockParcels,
            });
        });

        test("✅ getAllParcels should filter by zoneId", async () => {
            req.query = { zoneId: "1" };

            const mockParcels = [
                {
                    id: 1,
                    trackingCode: "LM-ABC123-XY45",
                    status: "pending",
                    zoneId: 1,
                    Zone: { id: 1, name: "Casablanca" },
                    Driver: null,
                },
            ];

            mockParcelFindAll.mockResolvedValue(mockParcels);

            await getAllParcels(req as Request, res as Response, next);

            expect(mockParcelFindAll).toHaveBeenCalledWith({
                where: { zoneId: "1" },
                include: expect.any(Array),
            });
            expect(mockStatus).toHaveBeenCalledWith(200);
        });

        test("✅ getAllParcels should filter by both status and zoneId", async () => {
            req.query = { status: "pending", zoneId: "1" };

            const mockParcels = [
                {
                    id: 1,
                    trackingCode: "LM-ABC123-XY45",
                    status: "pending",
                    zoneId: 1,
                    Zone: { id: 1, name: "Casablanca" },
                    Driver: null,
                },
            ];

            mockParcelFindAll.mockResolvedValue(mockParcels);

            await getAllParcels(req as Request, res as Response, next);

            expect(mockParcelFindAll).toHaveBeenCalledWith({
                where: { status: "pending", zoneId: "1" },
                include: expect.any(Array),
            });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockParcels,
            });
        });

        test("❌ getAllParcels should call next with error on exception", async () => {
            req.query = {};

            const mockError = new Error("Database error");
            mockParcelFindAll.mockRejectedValue(mockError);

            await getAllParcels(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe("getParcelById", () => {
        test("✅ getParcelById should return parcel if exists", async () => {
            const parcelId = "1";
            req.params = { id: parcelId };

            const mockZone = { id: 1, name: "Casablanca" };
            const mockDriver = { id: 1, name: "Ahmed" };
            const mockParcel = {
                id: 1,
                trackingCode: "LM-ABC123-XY45",
                status: "in-transit",
                pickupAddress: "123 Main St, Casablanca",
                pickupLat: 33.5731,
                pickupLng: -7.5898,
                deliveryAddress: "456 Oak Ave, Casablanca",
                deliveryLat: 33.5892,
                deliveryLng: -7.6031,
                weight: 5,
                zoneId: 1,
                driverId: 1,
                Zone: mockZone,
                Driver: mockDriver,
            };

            mockParcelFindByPk.mockResolvedValue(mockParcel);

            await getParcelById(req as Request, res as Response, next);

            expect(mockParcelFindByPk).toHaveBeenCalledWith(parcelId, {
                include: expect.any(Array),
            });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockParcel,
            });
        });

        test("❌ getParcelById should return 404 if parcel not found", async () => {
            req.params = { id: "999" };

            mockParcelFindByPk.mockResolvedValue(null);

            await getParcelById(req as Request, res as Response, next);

            expect(mockParcelFindByPk).toHaveBeenCalledWith("999", {
                include: expect.any(Array),
            });
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Parcel not found",
            });
        });

        test("❌ getParcelById should call next with error on exception", async () => {
            req.params = { id: "1" };

            const mockError = new Error("Database error");
            mockParcelFindByPk.mockRejectedValue(mockError);

            await getParcelById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });
});
