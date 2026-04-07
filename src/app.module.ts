import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { IncomeModule } from './income/income.module';
import { FixedExpenseModule } from './fixed-expense/fixed-expense.module';
import { ExpenseModule } from './expense/expense.module';
import { CategoryModule } from './category/category.module';
import { FinanceSummaryModule } from './finance-summary/finance-summary.module';
import { BankAccountModule } from './bank-account/bank-account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    IncomeModule,
    FixedExpenseModule,
    ExpenseModule,
    CategoryModule,
    FinanceSummaryModule,
    BankAccountModule,
  ],
})
export class AppModule {}
