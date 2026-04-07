import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { QueryIncomeDto } from './dto/query-income.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('income')
@UseGuards(JwtAuthGuard)
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateIncomeDto) {
    return this.incomeService.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query() query: QueryIncomeDto) {
    return this.incomeService.findAll(user.userId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.incomeService.findOne(user.userId, id);
  }

  @Put(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateIncomeDto) {
    return this.incomeService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.incomeService.remove(user.userId, id);
  }
}
