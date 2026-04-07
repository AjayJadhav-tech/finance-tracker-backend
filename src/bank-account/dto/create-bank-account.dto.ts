import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BankAccountType } from '@prisma/client';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  accountNumber?: string;

  @IsOptional()
  @IsEnum(BankAccountType)
  accountType?: BankAccountType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  balance?: number;

  @IsOptional()
  @IsString()
  color?: string;
}
