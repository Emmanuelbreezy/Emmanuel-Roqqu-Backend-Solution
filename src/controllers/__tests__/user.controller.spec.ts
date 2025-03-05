import { Application } from "express";
import request from "supertest";
import { AppDataSource } from "../../config/database.config";
import { HTTPSTATUS } from "../../config/http-status.config";
import { ErrorCodeEnum } from "../../enums/error-code.enum";
import { createApp } from "../../app";

jest.mock("../../config/database.config");

describe("User API", () => {
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

  describe("GET /users", () => {
    it("should return a list of users with pagination", async () => {
      const mockUsers = [
        { firstname: "Emmanuel", lastname: "Umeh", email: "emma@gmail.com" },
        { firstname: "Jane", lastname: "Joy", email: "jane@gmail.com" },
      ];
      const mockTotal = 2;

      const mockFindAndCount = jest
        .fn()
        .mockResolvedValue([mockUsers, mockTotal]);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findAndCount: mockFindAndCount,
      });

      const response = await request(app).get(
        "/api/users?pageNumber=0&pageSize=10"
      );

      expect(response.status).toBe(HTTPSTATUS.OK);
      expect(response.body).toEqual({
        message: "All users fetched successfully",
        users: mockUsers,
        pagination: {
          totalElements: mockTotal,
          pageNumber: 0,
          pageSize: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe("GET /users/count", () => {
    it("should return the total number of users", async () => {
      const mockCount = 10;
      const mockGetCount = jest.fn().mockResolvedValue(mockCount);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          getCount: mockGetCount,
        }),
      });

      const response = await request(app).get("/api/users/count");

      expect(response.status).toBe(HTTPSTATUS.OK);
      expect(response.body).toEqual({
        message: "Total number of user fetched successfully",
        data: {
          total: mockCount,
        },
      });
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user by ID", async () => {
      const mockUser = {
        id: 1,
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      };

      const mockFindOne = jest.fn().mockResolvedValue(mockUser);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      const response = await request(app).get("/api/users/1");

      expect(response.status).toBe(HTTPSTATUS.OK);
      expect(response.body).toEqual({
        message: "User detailed fetched successfully",
        data: {
          user: mockUser,
        },
      });
    });
    it("should return 404 if user is not found", async () => {
      const mockFindOne = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      const response = await request(app).get("/api/users/1");

      expect(response.status).toBe(HTTPSTATUS.NOT_FOUND);
      expect(response.body).toEqual({
        message: "User not found",
        errorCode: ErrorCodeEnum.RESOURCE_NOT_FOUND,
      });
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const mockUser = {
        id: 1,
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      };

      const mockFindOne = jest.fn().mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue(mockUser);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
        create: jest.fn().mockReturnValue(mockUser),
        save: mockSave,
      });

      const response = await request(app).post("/api/users").send({
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      });

      expect(response.status).toBe(HTTPSTATUS.CREATED);
      expect(response.body).toEqual({
        message: "User created successfully",
        data: {
          user: mockUser,
        },
      });
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe("emma@gmail.com");
    });

    it("should return 400 if user already exists", async () => {
      const mockUser = {
        id: 1,
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      };

      const mockFindOne = jest.fn().mockResolvedValue(mockUser);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      const response = await request(app).post("/api/users").send({
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      });
      expect(response.status).toBe(HTTPSTATUS.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "User already exists",
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
      });
    });
  });
});
