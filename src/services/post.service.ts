import { AppDataSource } from "../config/database.config";
import { CreatePostDTO } from "../database/dto/post.dto";
import { Post } from "../database/entities/post.entity";
import { User } from "../database/entities/user.entity";
import { NotFoundException } from "../utils/app-error";

export const getPostsByUserIdService = async (userId?: number) => {
  const postRepository = AppDataSource.getRepository(Post);

  const queryBuilder = postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.user", "user")
    .orderBy("post.createdAt", "DESC");

  if (userId) {
    queryBuilder.where("user.id = :userId", { userId });
  }

  const posts = await queryBuilder.getMany();
  return posts;
};

export const createPostService = async (createPostDTO: CreatePostDTO) => {
  const postRepository = AppDataSource.getRepository(Post);
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ id: createPostDTO.userId });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const post = postRepository.create({
    title: createPostDTO.title,
    body: createPostDTO.body,
    user,
  });
  await postRepository.save(post);

  return post;
};

export const deletePostService = async (postId: number) => {
  const postRepository = AppDataSource.getRepository(Post);

  const post = await postRepository.findOneBy({ id: postId });
  if (!post) {
    throw new NotFoundException("Post not found");
  }
  await postRepository.remove(post);
  return true;
};
