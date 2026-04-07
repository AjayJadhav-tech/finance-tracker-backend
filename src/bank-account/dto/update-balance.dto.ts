import { IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum BalanceOperation {
  SET = 'SET',
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
}

export class UpdateBalanceDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsEnum(BalanceOperation)
  operation: BalanceOperation;
}
