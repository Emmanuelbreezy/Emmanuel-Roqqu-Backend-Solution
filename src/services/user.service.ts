import { AppDataSource } from "../config/database.config";
import { CreateUserDTO } from "../database/dto/user.dto";
import { User } from "../database/entities/user.entity";
import { BadRequestException, NotFoundException } from "../utils/app-error";

export const getUsersService = async (pagination: {
  pageNumber: number;
  pageSize: number;
}) => {
  const { pageNumber, pageSize } = pagination;
  const userRepository = AppDataSource.getRepository(User);

  const skip = pageNumber * pageSize;
  const take = pageSize;
  const [users, total] = await userRepository.findAndCount({
    skip,
    take,
    order: { createdAt: "DESC" },
  });
  const totalPages = Math.ceil(total / pageSize);

  return {
    users,
    pagination: {
      totalElements: total,
      pageNumber,
      pageSize,
      totalPages,
    },
  };
};

export const getTotalUsersCountService = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const total = await userRepository.createQueryBuilder("user").getCount();

  return { total };
};

export const getUserByIdService = async (userId: number) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ["addresses"],
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return user;
};

export const createUserService = async (data: CreateUserDTO) => {
  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOne({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new BadRequestException("User already exists");
  }

  const user = userRepository.create(data);
  await userRepository.save(user);

  return { user };
};
