import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsNumberString,
} from "class-validator";

export class CreateAddressDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  houseNumber: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;
}

export class UpdateAddressDTO {
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class UserIdDTO {
  @IsNotEmpty()
  @IsNumberString()
  userId: string;
}
