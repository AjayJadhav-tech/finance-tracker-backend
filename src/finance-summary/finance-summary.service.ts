import { Injectable } from '@nestjs/common';
import { IncomeService } from '../income/income.service';
import { FixedExpenseService } from '../fixed-expense/fixed-expense.service';
import { ExpenseService } from '../expense/expense.service';

@Injectable()
export class FinanceSummaryService {
  constructor(
    private incomeService: IncomeService,
    private fixedExpenseService: FixedExpenseService,
    private expenseService: ExpenseService,
  ) {}

  async getSummary(userId: string, month: number, year: number) {
    const [salary, fixedExpenses, variableExpenseTotal, expensesByCategory, recentExpenses] =
      await Promise.all([
        this.incomeService.getForMonth(userId, month, year),
        this.fixedExpenseService.getMonthlyFixedExpenses(userId, month, year),
        this.expenseService.getMonthlyTotal(userId, month, year),
        this.expenseService.getMonthlySummaryByCategory(userId, month, year),
        this.expenseService.getRecent(userId, 5),
      ]);

    const salaryAmount = salary ? Number(salary.amount) : 0;
    const totalFixed = fixedExpenses.reduce((sum, fe) => sum + Number(fe.amount), 0);
    const totalMandatory = fixedExpenses
      .filter((fe) => fe.isMandatory)
      .reduce((sum, fe) => sum + Number(fe.amount), 0);

    return {
      month,
      year,
      salary: salaryAmount,
      totalFixedExpenses: totalFixed,
      totalMandatoryFixed: totalMandatory,
      totalOptionalFixed: totalFixed - totalMandatory,
      totalVariableExpenses: variableExpenseTotal,
      remaining: salaryAmount - totalFixed - variableExpenseTotal,
      fixedExpenses,
      variableExpensesByCategory: expensesByCategory,
      recentExpenses,
    };
  }
}
