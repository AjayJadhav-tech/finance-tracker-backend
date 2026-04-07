import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpenseDto } from './dto/query-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        amount: dto.amount,
        description: dto.description,
        categoryId: dto.categoryId,
        date: new Date(dto.date),
      },
      include: { category: true },
    });
  }

  async findAll(userId: string, query: QueryExpenseDto) {
    const { page = 1, limit = 20, startDate, endDate, categoryId } = query;
    const where: Prisma.ExpenseWhereInput = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    if (categoryId) where.categoryId = categoryId;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!expense || expense.userId !== userId) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.findOne(userId, id);
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    return this.prisma.expense.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.expense.delete({ where: { id } });
  }

  async getMonthlyTotal(userId: string, month: number, year: number): Promise<number> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const result = await this.prisma.expense.aggregate({
      where: { userId, date: { gte: start, lte: end } },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  async getMonthlySummaryByCategory(userId: string, month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const grouped = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: { userId, date: { gte: start, lte: end } },
      _sum: { amount: true },
    });

    const categories = await this.prisma.category.findMany();
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    return grouped.map((g) => ({
      category: categoryMap.get(g.categoryId),
      total: Number(g._sum.amount ?? 0),
    }));
  }

  async getRecent(userId: string, limit: number = 5) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }
}
