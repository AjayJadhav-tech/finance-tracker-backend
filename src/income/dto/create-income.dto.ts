import { IsNumber, IsInt, Min, Max, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncomeDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year: number;
}
