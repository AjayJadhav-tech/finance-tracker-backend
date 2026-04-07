import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { QueryIncomeDto } from './dto/query-income.dto';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateIncomeDto) {
    return this.prisma.salary.upsert({
      where: {
        userId_month_year: {
          userId,
          month: dto.month,
          year: dto.year,
        },
      },
      update: { amount: dto.amount },
      create: {
        userId,
        amount: dto.amount,
        month: dto.month,
        year: dto.year,
      },
    });
  }

  async findAll(userId: string, query: QueryIncomeDto) {
    const where: any = { userId };
    if (query.month) where.month = query.month;
    if (query.year) where.year = query.year;

    return this.prisma.salary.findMany({
      where,
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const salary = await this.prisma.salary.findUnique({ where: { id } });
    if (!salary || salary.userId !== userId) {
      throw new NotFoundException('Salary record not found');
    }
    return salary;
  }

  async update(userId: string, id: string, dto: UpdateIncomeDto) {
    await this.findOne(userId, id);
    return this.prisma.salary.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.salary.delete({ where: { id } });
  }

  async getForMonth(userId: string, month: number, year: number) {
    return this.prisma.salary.findUnique({
      where: {
        userId_month_year: { userId, month, year },
      },
    });
  }
}
