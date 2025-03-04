import { IsEmail, IsNotEmpty, IsNumberString } from "class-validator";

export class CreateUserDTO {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserIdDTO {
  @IsNotEmpty()
  @IsNumberString()
  id: string;
}
