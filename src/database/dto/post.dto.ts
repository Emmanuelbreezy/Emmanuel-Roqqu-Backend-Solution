import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsNumberString,
} from "class-validator";

export class CreatePostDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class PostIdDTO {
  @IsNotEmpty()
  @IsNumberString()
  id: string;
}
