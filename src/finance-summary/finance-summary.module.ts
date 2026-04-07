import { Module } from '@nestjs/common';
import { FinanceSummaryController } from './finance-summary.controller';
import { FinanceSummaryService } from './finance-summary.service';
import { IncomeModule } from '../income/income.module';
import { FixedExpenseModule } from '../fixed-expense/fixed-expense.module';
import { ExpenseModule } from '../expense/expense.module';

@Module({
  imports: [IncomeModule, FixedExpenseModule, ExpenseModule],
  controllers: [FinanceSummaryController],
  providers: [FinanceSummaryService],
})
export class FinanceSummaryModule {}
