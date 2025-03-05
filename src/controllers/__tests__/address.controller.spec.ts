import request from "supertest";
import { AppDataSource } from "../../config/database.config";
import { Address } from "../../database/entities/address.entity";
import { User } from "../../database/entities/user.entity";
import { HTTPSTATUS } from "../../config/http-status.config";
import { createApp } from "../../app";
import { Application } from "express";
import { ErrorCodeEnum } from "../../enums/error-code.enum";

jest.mock("../../config/database.config");

describe("Addresses API", () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /addresses/:userId", () => {
    it("should return the address for a user", async () => {
      const mockAddress = {
        id: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
        user: {
          id: 1,
          firstname: "Emmanuel",
          lastname: "Umeh",
          email: "emma@gmail.com",
        },
      };
      const mockFindOne = jest.fn().mockResolvedValue(mockAddress);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      const response = await request(app).get("/api/addresses/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Address fetched successfully",
        data: { address: mockAddress },
      });
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ["user"],
      });
    });

    it("should return 404 if address is not found", async () => {
      const mockFindOne = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      const response = await request(app).get("/api/addresses/1");

      expect(response.status).toBe(HTTPSTATUS.NOT_FOUND);
      expect(response.body).toEqual({
        message: "Address not found for the user",
        errorCode: ErrorCodeEnum.RESOURCE_NOT_FOUND,
      });
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ["user"],
      });
    });
  });

  describe("POST /addresses", () => {
    it("should create a new address for a user", async () => {
      const mockUser = {
        id: 1,
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      };
      const mockAddress = {
        id: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
        user: mockUser,
      };
      const mockFindOneBy = jest.fn().mockResolvedValue(mockUser);
      const mockFindOne = jest.fn().mockResolvedValue(null);

      const mockCreate = jest.fn().mockReturnValue(mockAddress);
      const mockSave = jest.fn().mockResolvedValue(mockAddress);
      AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
        if (entity === User) {
          return {
            findOneBy: mockFindOneBy,
          };
        } else if (entity === Address) {
          return {
            findOne: mockFindOne,
            create: mockCreate,
            save: mockSave,
          };
        }
      });

      const response = await request(app).post("/api/addresses").send({
        userId: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
      });

      expect(response.status).toBe(HTTPSTATUS.CREATED);
      expect(response.body).toEqual({
        message: "Address created successfully",
        data: { address: mockAddress },
      });
    });

    it("should return 404 if user is not found", async () => {
      const mockFindOneBy = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: mockFindOneBy,
      });
      const response = await request(app).post("/api/addresses").send({
        userId: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
      });
      expect(response.status).toBe(HTTPSTATUS.NOT_FOUND);
      expect(response.body).toEqual({
        message: "User not found",
        errorCode: ErrorCodeEnum.RESOURCE_NOT_FOUND,
      });
    });

    it("should return 400 if user already has an address", async () => {
      const mockUser = {
        id: 1,
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      };
      const mockAddress = {
        id: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
        user: mockUser,
      };

      const mockFindOneBy = jest.fn().mockResolvedValue(mockUser);
      const mockFindOne = jest.fn().mockResolvedValue(mockAddress);
      AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
        if (entity === User) {
          return {
            findOneBy: mockFindOneBy,
          };
        } else if (entity === Address) {
          return {
            findOne: mockFindOne,
          };
        }
      });

      const response = await request(app).post("/api/addresses").send({
        userId: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
      });

      expect(response.status).toBe(HTTPSTATUS.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "User already has an address",
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
      });
    });
  });

  describe("PATCH /addresses/:userId", () => {
    it("should update the address for a user", async () => {
      const mockAddress = {
        id: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
        user: {
          id: 1,
          firstname: "Emmanuel",
          lastname: "Umeh",
          email: "emma@gmail.com",
        },
      };

      const mockFindOne = jest.fn().mockResolvedValue(mockAddress);
      const mockSave = jest.fn().mockResolvedValue(mockAddress);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
        save: mockSave,
      });

      const response = await request(app).patch("/api/addresses/1").send({
        houseNumber: "16",
        street: "Itnola Babs ",
        city: "Ikeja",
        state: "Lagos",
      });

      expect(response.status).toBe(HTTPSTATUS.OK);
      expect(response.body).toEqual({
        message: "Address updated successfully",
        data: { address: mockAddress },
      });
    });

    it("should return 404 if address is not found", async () => {
      const mockFindOne = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });
      const response = await request(app).patch("/api/addresses/1").send({
        houseNumber: "16",
        street: "Itnola Babs ",
        city: "Ikeja",
        state: "Lagos",
      });
      expect(response.status).toBe(HTTPSTATUS.NOT_FOUND);
      expect(response.body).toEqual({
        message: "Address not found for the user",
        errorCode: ErrorCodeEnum.RESOURCE_NOT_FOUND,
      });
    });
  });
});
