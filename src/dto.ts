import { IsString, IsInt, Min, Matches, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Example for validating a payload stored in JSON data.
 * JSON already types data correctly, so you can expect numbers, strings and booleans where it needs to be.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]+$/i)
  name!: string;

  @IsInt()
  @Min(18)
  age!: number;
}

/**
 * Example for validating a payload stored in request parameters.
 * Every values comes from the network as a `string` so you need to use `@Transform` to cast `string`s to the desired type.
 */
export class GetUserParamsDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  /** Parameter `:id` of the URL */
  id!: number;
}

/**
 * Example for validating a payload stored in query string, with optional and required data.
 * Every values comes from the network as a `string` so you need to use `@Transform` to cast `string`s to the desired type.
 */
 export class GetUserByQueryDto {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  /** Search a user by ID! */
  id?: number;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  /** Search a user by name! */
  name?: string;

  @IsString()
  @IsNotEmpty()
  /** Required! If not specified, validation will fail. */
  password!: string;
}
