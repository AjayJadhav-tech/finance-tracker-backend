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
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpenseDto } from './dto/query-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateExpenseDto) {
    return this.expenseService.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query() query: QueryExpenseDto) {
    return this.expenseService.findAll(user.userId, query);
  }

  @Get('summary/by-category')
  getSummaryByCategory(
    @CurrentUser() user: any,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.expenseService.getMonthlySummaryByCategory(
      user.userId,
      parseInt(month),
      parseInt(year),
    );
  }

  @Get('recent')
  getRecent(@CurrentUser() user: any) {
    return this.expenseService.getRecent(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expenseService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expenseService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expenseService.remove(user.userId, id);
  }
}
