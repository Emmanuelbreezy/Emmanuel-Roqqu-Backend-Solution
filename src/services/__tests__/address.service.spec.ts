import { AppDataSource } from "../../config/database.config";
import {
  getAddressByUserIdService,
  createAddressService,
  updateAddressService,
} from "../address.service";
import { Address } from "../../database/entities/address.entity";
import { User } from "../../database/entities/user.entity";
import { BadRequestException, NotFoundException } from "../../utils/app-error";

// Mock the AppDataSource
jest.mock("../../config/database.config");

describe("Address Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAddressByUserIdService", () => {
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

      const result = await getAddressByUserIdService(1);

      expect(result).toEqual(mockAddress);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ["user"],
      });
    });
    it("should throw NotFoundException if address is not found", async () => {
      const mockFindOne = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      await expect(getAddressByUserIdService(1)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("createAddressService", () => {
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
      const result = await createAddressService({
        userId: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
      });

      expect(result).toEqual(mockAddress);
      expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw NotFoundException if user is not found", async () => {
      const mockFindOneBy = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: mockFindOneBy,
      });

      await expect(
        createAddressService({
          userId: 1,
          houseNumber: "06",
          street: "Babs Itnola",
          city: "Ikeja",
          state: "Lagos",
        })
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException if user already has an address", async () => {
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

      await expect(
        createAddressService({
          userId: 1,
          houseNumber: "06",
          street: "Babs Itnola",
          city: "Ikeja",
          state: "Lagos",
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateAddressService", () => {
    it("should update the address for a user", async () => {
      const mockAddress = {
        id: 1,
        houseNumber: "06",
        street: "Babs Itnola",
        city: "Ikeja",
        state: "Lagos",
        user: { id: 1 },
      };

      const mockFindOne = jest.fn().mockResolvedValue(mockAddress);
      const mockSave = jest.fn().mockResolvedValue(mockAddress);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
        save: mockSave,
      });

      const result = await updateAddressService(1, {
        houseNumber: "16",
        street: "Itnola Babs ",
        city: "Ikeja",
        state: "Lagos",
      });

      expect(result).toEqual(mockAddress);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw NotFoundException if address is not found", async () => {
      const mockFindOne = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: mockFindOne,
      });

      await expect(
        updateAddressService(1, {
          houseNumber: "16",
          street: "Itnola Babs ",
          city: "Ikeja",
          state: "Lagos",
        })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
