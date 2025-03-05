import { AppDataSource } from "../../config/database.config";
import {
  createUserService,
  getTotalUsersCountService,
  getUserByIdService,
  getUsersService,
} from "../../services/user.service";
import { BadRequestException } from "../../utils/app-error";

jest.mock("../../config/database.config");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsersService", () => {
    it("should return a list of users with pagination", async () => {
      const mockUsers = [
        {
          id: 1,
          firstname: "Emmanuel",
          lastname: "Umeh",
          email: "emma@gmail.com",
        },
      ];
      const mockTotal = 1;

      const mockFindAndCount = jest
        .fn()
        .mockResolvedValue([mockUsers, mockTotal]);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findAndCount: mockFindAndCount,
      });

      const result = await getUsersService({ pageNumber: 0, pageSize: 10 });

      expect(result.users).toEqual(mockUsers);
      expect(result.pagination.totalElements).toBe(mockTotal);
      expect(mockFindAndCount).toHaveBeenCalled();
    });
  });

  describe("getTotalUsersCountService", () => {
    it("should return a total users count", async () => {
      const mockTotal = 10;
      const mockGetCount = jest.fn().mockResolvedValue(mockTotal);
      const mockCreateQueryBuilder = jest.fn().mockReturnValue({
        getCount: mockGetCount,
      });
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        createQueryBuilder: mockCreateQueryBuilder,
      });
      const result = await getTotalUsersCountService();

      expect(result.total).toBe(mockTotal);
      expect(mockCreateQueryBuilder).toHaveBeenCalledWith("user");
      expect(mockGetCount).toHaveBeenCalled();
    });
  });

  describe("getUserByIdService", () => {
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

      const result = await getUserByIdService(1);

      expect(result).toEqual(mockUser);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["address"],
      });
    });
    it("should throw an error if user is not found", async () => {
      const mockFindOne = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });
      await expect(getUserByIdService(1)).rejects.toThrow("User not found");
    });
  });

  describe("createUserService", () => {
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

      const result = await createUserService({
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      });

      expect(result).toEqual({ user: mockUser });

      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email: "emma@gmail.com" },
      });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw BadRequestException if user already exist", async () => {
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

      await expect(
        createUserService({
          firstname: "Emmanuel",
          lastname: "Umeh",
          email: "emma@gmail.com",
        })
      ).rejects.toThrow(BadRequestException);
    });
  });
});
