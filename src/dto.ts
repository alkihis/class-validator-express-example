import { MinLength, IsString, IsInt, Min, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @Matches(/^[A-Z]+$/i)
  name!: string;

  @IsInt()
  @Min(18)
  age!: number;
}

export class GetUserParamsDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  id!: number;
}
