import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { UpdateBalanceDto, BalanceOperation } from './dto/update-balance.dto';

@Injectable()
export class BankAccountService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBankAccountDto) {
    return this.prisma.bankAccount.create({
      data: {
        userId,
        accountName: dto.accountName,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        accountType: dto.accountType,
        balance: dto.balance ?? 0,
        color: dto.color,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.bankAccount.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.bankAccount.findUnique({ where: { id } });
    if (!account || account.userId !== userId) {
      throw new NotFoundException('Bank account not found');
    }
    return account;
  }

  async update(userId: string, id: string, dto: UpdateBankAccountDto) {
    await this.findOne(userId, id);
    return this.prisma.bankAccount.update({
      where: { id },
      data: dto,
    });
  }

  async updateBalance(userId: string, id: string, dto: UpdateBalanceDto) {
    const account = await this.findOne(userId, id);
    let newBalance: number;

    switch (dto.operation) {
      case BalanceOperation.SET:
        newBalance = dto.amount;
        break;
      case BalanceOperation.ADD:
        newBalance = Number(account.balance) + dto.amount;
        break;
      case BalanceOperation.SUBTRACT:
        newBalance = Number(account.balance) - dto.amount;
        break;
    }

    return this.prisma.bankAccount.update({
      where: { id },
      data: { balance: newBalance },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.bankAccount.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getTotalBalance(userId: string): Promise<number> {
    const result = await this.prisma.bankAccount.aggregate({
      where: { userId, isActive: true },
      _sum: { balance: true },
    });
    return Number(result._sum.balance ?? 0);
  }
}
