import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FinanceSummaryService } from './finance-summary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('finance-summary')
@UseGuards(JwtAuthGuard)
export class FinanceSummaryController {
  constructor(private financeSummaryService: FinanceSummaryService) {}

  @Get()
  getSummary(
    @CurrentUser() user: any,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.financeSummaryService.getSummary(
      user.userId,
      parseInt(month),
      parseInt(year),
    );
  }
}
