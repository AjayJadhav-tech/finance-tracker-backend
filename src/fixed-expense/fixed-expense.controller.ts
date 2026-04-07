import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FixedExpenseService } from './fixed-expense.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { QueryFixedExpenseDto } from './dto/query-fixed-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('fixed-expenses')
@UseGuards(JwtAuthGuard)
export class FixedExpenseController {
  constructor(private fixedExpenseService: FixedExpenseService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateFixedExpenseDto) {
    return this.fixedExpenseService.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query() query: QueryFixedExpenseDto) {
    return this.fixedExpenseService.findAll(user.userId, query);
  }

  @Get('monthly')
  getMonthly(
    @CurrentUser() user: any,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.fixedExpenseService.getMonthlyFixedExpenses(
      user.userId,
      parseInt(month),
      parseInt(year),
    );
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.fixedExpenseService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateFixedExpenseDto) {
    return this.fixedExpenseService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.fixedExpenseService.remove(user.userId, id);
  }
}
