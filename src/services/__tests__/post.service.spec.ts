import { AppDataSource } from "../../config/database.config";
import {
  getPostsByUserIdService,
  createPostService,
  deletePostService,
} from "../post.service";
import { Post } from "../../database/entities/post.entity";
import { User } from "../../database/entities/user.entity";
import { NotFoundException } from "../../utils/app-error";

jest.mock("../../config/database.config");

describe("Post Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPostsByUserIdService", () => {
    it("should return all posts if userId is not provided", async () => {
      const mockPosts = [
        {
          id: 1,
          title: "Post 1",
          body: "Body 1",
          user: {
            id: 1,
            firstname: "Emmanuel",
            lastname: "Umeh",
            email: "emma@gmail.com",
          },
        },
        {
          id: 2,
          title: "Post 2",
          body: "Body 2",
          user: {
            id: 2,
            firstname: "Jane",
            lastname: "Joy",
            email: "jane@gmail.com",
          },
        },
      ];
      const mockGetMany = jest.fn().mockResolvedValue(mockPosts);
      const mockCreateQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: mockGetMany,
      });
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        createQueryBuilder: mockCreateQueryBuilder,
      });

      const result = await getPostsByUserIdService();

      expect(result).toEqual(mockPosts);
      expect(mockCreateQueryBuilder).toHaveBeenCalledWith("post");
      expect(mockGetMany).toHaveBeenCalled();
    });

    it("should return posts for a specific user if userId is provided", async () => {
      const mockPosts = [
        {
          id: 1,
          title: "Post 1",
          body: "Body 1",
          user: {
            id: 1,
            firstname: "Emmanuel",
            lastname: "Umeh",
            email: "emma@gmail.com",
          },
        },
      ];
      const mockGetMany = jest.fn().mockResolvedValue(mockPosts);
      const mockCreateQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: mockGetMany,
      });

      AppDataSource.getRepository = jest.fn().mockReturnValue({
        createQueryBuilder: mockCreateQueryBuilder,
      });

      const result = await getPostsByUserIdService(1);

      expect(result).toEqual(mockPosts);
      expect(mockCreateQueryBuilder).toHaveBeenCalledWith("post");
      expect(mockGetMany).toHaveBeenCalled();
    });
  });

  describe("createPostService", () => {
    it("should create a new post", async () => {
      const mockUser = {
        id: 1,
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      };
      const mockPost = {
        id: 1,
        title: "New Post",
        body: "Post Body",
        user: mockUser,
      };
      const mockFindOneBy = jest.fn().mockResolvedValue(mockUser);
      const mockCreate = jest.fn().mockReturnValue(mockPost);
      const mockSave = jest.fn().mockResolvedValue(mockPost);

      AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
        if (entity === User) {
          return {
            findOneBy: mockFindOneBy,
          };
        } else if (entity === Post) {
          return {
            create: mockCreate,
            save: mockSave,
          };
        }
      });

      const result = await createPostService({
        userId: 1,
        title: "New Post",
        body: "Post Body",
      });

      expect(result).toEqual(mockPost);
      expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw NotFoundException if user is not found", async () => {
      const mockFindOneBy = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: mockFindOneBy,
      });
      await expect(
        createPostService({
          userId: 1,
          title: "New Post",
          body: "Post Body",
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("deletePostService", () => {
    it("should delete a post", async () => {
      const mockPost = {
        id: 1,
        title: "Post 1",
        body: "Body 1",
        user: {
          id: 1,
          firstname: "Emmanuel",
          lastname: "Umeh",
          email: "emma@gmail.com",
        },
      };

      const mockFindOneBy = jest.fn().mockResolvedValue(mockPost);
      const mockRemove = jest.fn().mockResolvedValue(true);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: mockFindOneBy,
        remove: mockRemove,
      });

      const result = await deletePostService(1);

      expect(result).toBe(true);
      expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRemove).toHaveBeenCalledWith(mockPost);
    });

    it("should throw NotFoundException if post is not found", async () => {
      const mockFindOneBy = jest.fn().mockResolvedValue(null);
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: mockFindOneBy,
      });
      await expect(deletePostService(1)).rejects.toThrow(NotFoundException);
    });
  });
});
