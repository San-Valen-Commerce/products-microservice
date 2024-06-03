import { IsInt, IsPositive } from 'class-validator';

export class ValidateProductDto {
  @IsInt()
  @IsPositive()
  id!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}
