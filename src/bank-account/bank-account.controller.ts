import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('bank-accounts')
@UseGuards(JwtAuthGuard)
export class BankAccountController {
  constructor(private bankAccountService: BankAccountService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateBankAccountDto) {
    return this.bankAccountService.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.bankAccountService.findAll(user.userId);
  }

  @Get('total-balance')
  getTotalBalance(@CurrentUser() user: any) {
    return this.bankAccountService.getTotalBalance(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bankAccountService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateBankAccountDto) {
    return this.bankAccountService.update(user.userId, id, dto);
  }

  @Patch(':id/balance')
  updateBalance(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateBalanceDto,
  ) {
    return this.bankAccountService.updateBalance(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bankAccountService.remove(user.userId, id);
  }
}
