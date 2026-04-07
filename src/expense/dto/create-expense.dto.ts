import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsDateString()
  date: string;
}
