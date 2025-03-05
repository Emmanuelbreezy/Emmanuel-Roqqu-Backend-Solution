import request from "supertest";
import { Application } from "express";
import { createApp } from "../../app";
import { AppDataSource } from "../../config/database.config";
import { HTTPSTATUS } from "../../config/http-status.config";
import { BadRequestException } from "../../utils/app-error";
import { ErrorCodeEnum } from "../../enums/error-code.enum";
import { User } from "../../database/entities/user.entity";
import { Post } from "../../database/entities/post.entity";

describe("Post API", () => {
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

  describe("GET /posts", () => {
    it("should return posts for a specific user", async () => {
      const mockPosts = [
        { id: 1, title: "Emma Post 1", body: "Post body", userId: 1 },
        { id: 2, title: "My Emma Post 2", body: "Post body", userId: 1 },
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

      const response = await request(app).get("/api/posts?userId=1");

      expect(response.status).toBe(HTTPSTATUS.OK);
      expect(response.body).toEqual({
        message: "Posts fetched successfully",
        data: { posts: mockPosts },
      });
    });
  });

  //////
  describe("POST /posts", () => {
    it("should create a new post", async () => {
      const mockUser = {
        id: 1,
        firstname: "Emmanuel",
        lastname: "Umeh",
        email: "emma@gmail.com",
      };

      const mockPost = {
        id: 1,
        title: "Emma Post 1",
        body: "Post body",
        userId: 1,
      };

      // Mock the User repository
      const mockFindOneBy = jest.fn().mockResolvedValue(mockUser);
      const mockSave = jest.fn().mockResolvedValue(mockPost);

      // Mock both repositories
      AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
        if (entity === User) {
          return {
            findOneBy: mockFindOneBy,
          };
        } else if (entity === Post) {
          return {
            create: jest.fn().mockReturnValue(mockPost),
            save: mockSave,
          };
        }
      });

      const response = await request(app).post("/api/posts").send({
        title: "Emma Post 1",
        body: "Post body",
        userId: 1,
      });

      expect(response.status).toBe(HTTPSTATUS.CREATED);
      expect(response.body).toEqual({
        message: "Post created successfully",
        data: { post: mockPost },
      });

      // Ensure the repositories were called correctly
      expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockSave).toHaveBeenCalled();
    });

    it("should handle validation errors", async () => {
      const mockError = new BadRequestException("Validation error");
      const mockSave = jest.fn().mockRejectedValue(mockError);

      // Mock the Post repository
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        save: mockSave,
      });

      const response = await request(app).post("/api/posts").send({
        title: "",
        body: "New Post body",
        userId: 1,
      });

      expect(response.status).toBe(HTTPSTATUS.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Validation failed",
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
        errors: [
          {
            field: "title",
            message: {
              isNotEmpty: "title should not be empty",
            },
          },
        ],
      });
    });
  });

  describe("DELETE /posts/:id", () => {
    it("should delete a post", async () => {
      const mockPost = {
        id: 1,
        title: "Emma Post 1",
        body: "Post body",
        userId: 1,
      };
      const mockFindOneBy = jest.fn().mockResolvedValue(mockPost);
      const mockRemove = jest.fn().mockResolvedValue(true);

      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: mockFindOneBy,
        remove: mockRemove,
      });

      const response = await request(app).delete("/api/posts/1");

      expect(response.status).toBe(HTTPSTATUS.OK);
      expect(response.body).toEqual({
        message: "Post deleted successfully",
      });

      expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRemove).toHaveBeenCalledWith(mockPost);
    });

    it("should return 404 if post is not found", async () => {
      const mockFindOneBy = jest.fn().mockResolvedValue(null);

      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: mockFindOneBy,
      });

      const response = await request(app).delete("/api/posts/999");

      expect(response.status).toBe(HTTPSTATUS.NOT_FOUND);
      expect(response.body).toEqual({
        message: "Post not found",
        errorCode: ErrorCodeEnum.RESOURCE_NOT_FOUND,
      });
      expect(mockFindOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it("should handle invalid postId", async () => {
      const mockError = new BadRequestException(
        "postId must be a valid number"
      );
      const mockDelete = jest.fn().mockRejectedValue(mockError);

      AppDataSource.getRepository = jest.fn().mockReturnValue({
        delete: mockDelete,
      });

      const response = await request(app).delete("/api/posts/invalid");

      expect(response.status).toBe(HTTPSTATUS.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Validation failed",
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
        errors: [
          {
            field: "id",
            message: {
              isNumberString: "id must be a number string",
            },
          },
        ],
      });
    });
  });
});
