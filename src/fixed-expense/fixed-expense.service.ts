import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { QueryFixedExpenseDto } from './dto/query-fixed-expense.dto';

@Injectable()
export class FixedExpenseService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFixedExpenseDto) {
    return this.prisma.fixedExpense.create({
      data: {
        userId,
        name: dto.name,
        amount: dto.amount,
        category: dto.category,
        isMandatory: dto.isMandatory ?? true,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async findAll(userId: string, query: QueryFixedExpenseDto) {
    const where: any = { userId };
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.isMandatory !== undefined) where.isMandatory = query.isMandatory;

    return this.prisma.fixedExpense.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.fixedExpense.findUnique({ where: { id } });
    if (!expense || expense.userId !== userId) {
      throw new NotFoundException('Fixed expense not found');
    }
    return expense;
  }

  async update(userId: string, id: string, dto: UpdateFixedExpenseDto) {
    await this.findOne(userId, id);
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.fixedExpense.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.fixedExpense.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getMonthlyFixedExpenses(userId: string, month: number, year: number) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    return this.prisma.fixedExpense.findMany({
      where: {
        userId,
        isActive: true,
        startDate: { lte: endOfMonth },
        OR: [{ endDate: null }, { endDate: { gte: startOfMonth } }],
      },
      orderBy: { amount: 'desc' },
    });
  }

  async getMonthlyTotal(userId: string, month: number, year: number): Promise<number> {
    const expenses = await this.getMonthlyFixedExpenses(userId, month, year);
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }
}
