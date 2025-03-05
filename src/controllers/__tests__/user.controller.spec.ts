import express from "express";
import request from "supertest";
import { AppDataSource } from "../../config/database.config";
import { HTTPSTATUS } from "../../config/http-status.config";
import {
  getUsersController,
  getUserByIdController,
  createUserController,
} from "../../controllers/user.controller";
import { ErrorCodeEnum } from "../../enums/error-code.enum";

const app = express();
app.use(express.json());

jest.mock("../../config/database.config");

app.get("/users", getUsersController);
app.get("/users/:id", getUserByIdController);
app.post("/users", createUserController);

describe("User API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /users", () => {
    it("should return a list of users with pagination", async () => {
      const mockUsers = [{ id: 1, firstname: "John", lastname: "Doe" }];
      const mockTotal = 1;

      const mockFindAndCount = jest
        .fn()
        .mockResolvedValue([mockUsers, mockTotal]);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findAndCount: mockFindAndCount,
      });

      const response = await request(app).get(
        "/users?pageNumber=0&pageSize=10"
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

  describe("GET /users/:id", () => {
    it("should return a user by ID", async () => {
      const mockUser = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      };

      const mockFindOne = jest.fn().mockResolvedValue(mockUser);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      const response = await request(app).get("/users/1");

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

      const response = await request(app).get("/users/1");

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
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      };

      const mockFindOne = jest.fn().mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue(mockUser);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
        create: jest.fn().mockReturnValue(mockUser),
        save: mockSave,
      });

      const response = await request(app).post("/users").send({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      });

      expect(response.status).toBe(HTTPSTATUS.CREATED);
      expect(response.body).toEqual({
        message: "User created successfully",
        data: {
          user: mockUser,
        },
      });
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe("john@example.com");
    });

    it("should return 400 if user already exists", async () => {
      const mockUser = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      };

      const mockFindOne = jest.fn().mockResolvedValue(mockUser);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      const response = await request(app).post("/users").send({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      });
      expect(response.status).toBe(HTTPSTATUS.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "User already exists",
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
      });
    });
  });
});
