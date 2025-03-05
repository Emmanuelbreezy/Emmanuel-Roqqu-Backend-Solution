import {
  CreateAddressDTO,
  UpdateAddressDTO,
} from "../database/dto/address.dto";
import { AppDataSource } from "../config/database.config";
import { Address } from "../database/entities/address.entity";
import { User } from "../database/entities/user.entity";
import { BadRequestException, NotFoundException } from "../utils/app-error";

export const getAddressByUserIdService = async (userId: number) => {
  const addressRepository = AppDataSource.getRepository(Address);

  const address = await addressRepository.findOne({
    where: { user: { id: userId } },
    relations: ["user"],
  });

  if (!address) {
    throw new NotFoundException("Address not found for the user");
  }
  return address;
};

export const createAddressService = async (
  createAddressDTO: CreateAddressDTO
) => {
  const addressRepository = AppDataSource.getRepository(Address);
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ id: createAddressDTO.userId });
  if (!user) {
    throw new NotFoundException("User not found");
  }
  const existingAddress = await addressRepository.findOne({
    where: { user: { id: createAddressDTO.userId } },
  });

  if (existingAddress) {
    throw new BadRequestException("User already has an address");
  }

  const address = addressRepository.create({
    ...createAddressDTO,
    user,
  });

  await addressRepository.save(address);
  return address;
};

export const updateAddressService = async (
  userId: number,
  updateAddressDTO: UpdateAddressDTO
) => {
  const addressRepository = AppDataSource.getRepository(Address);

  const address = await addressRepository.findOne({
    where: { user: { id: userId } },
  });

  if (!address) {
    throw new NotFoundException("Address not found for the user");
  }

  if (updateAddressDTO.houseNumber !== undefined) {
    address.houseNumber = updateAddressDTO.houseNumber;
  }
  if (updateAddressDTO.street !== undefined) {
    address.street = updateAddressDTO.street;
  }
  if (updateAddressDTO.city !== undefined) {
    address.city = updateAddressDTO.city;
  }
  if (updateAddressDTO.state !== undefined) {
    address.state = updateAddressDTO.state;
  }

  await addressRepository.save(address);

  return address;
};
