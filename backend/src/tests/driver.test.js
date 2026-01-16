import { jest } from "@jest/globals";
const mockDriverCreate = jest.fn();
const mockDriverFindByPk = jest.fn();
const mockDriverFindAll = jest.fn();
const mockZoneFindByPk = jest.fn();
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
const { createDriver, getDriverById } = await import("../controllers/driverControllers.js");
describe("Driver Controllers", () => {
    let req;
    let res;
    let next;
    let mockJson;
    let mockStatus;
    beforeEach(() => {
        req = {};
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson }));
        res = {
            status: mockStatus,
            json: mockJson,
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    test("✅ createDriver should create driver successfully", async () => {
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
        await createDriver(req, res, next);
        expect(mockZoneFindByPk).toHaveBeenCalledWith(1);
        expect(mockDriverCreate).toHaveBeenCalledWith(req.body);
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            success: true,
            data: mockDriver,
        });
        const driverId = mockJson.mock.calls[0][0].data.id;
        console.log("Driver ID from createDriver:", driverId);
        req.params = { id: driverId.toString() };
    });
    test("✅ getDriverById should return driver if exists", async () => {
        const driverId = "10";
        req.params = { id: driverId };
        const mockZone = { id: 1, name: "Casablanca" };
        const mockDriverWithZone = {
            id: 10,
            name: "Youssef",
            phone: "0600000000",
            latitude: 33.5,
            longitude: -7.6,
            capacity: 10,
            status: "available",
            zoneId: 1,
            Zone: mockZone,
        };
        mockDriverFindByPk.mockResolvedValue(mockDriverWithZone);
        await getDriverById(req, res, next);
        expect(mockDriverFindByPk).toHaveBeenCalledWith(driverId, {
            include: [{ model: (await import("../models/index.js")).Zone }],
        });
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
            success: true,
            data: mockDriverWithZone,
        });
    });
});
