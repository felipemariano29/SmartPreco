/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';

import { ContextEnum } from '../../shared/context/context.enum';
import { ContextService } from '../../shared/context/context.service';
import { PriceService } from '../price/price.service';
import { ReportCreateDto, ReportDto, ReportsDto, ReportUpdateDto } from './report.dto';
import { ReportStatusEnum } from './report.enum';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {

  public constructor(
    private readonly reportRepository: ReportRepository,
    private readonly priceService: PriceService,
    private readonly contextService: ContextService
  ) {}

  public async createReport(params: ReportCreateDto): Promise<ReportDto> {
    const { priceId, reason } = params;

    const { id } = this.contextService.get(ContextEnum.USER);

    const report = await this.reportRepository.createReport({
      user_id: id,
      price_id: priceId,
      reason
    });

    await this.priceService.updateModeratedFlag(priceId, false);

    return this.toReportDto(report);
  }

  public async readReports(): Promise<ReportsDto> {
    const reports = await this.reportRepository.readReports();

    return { reports: reports.map(this.toReportDto) };
  }

  public async updateReportById(reportId: string, params: ReportUpdateDto): Promise<ReportDto> {
    const { status } = params;

    const updatedReport = await this.reportRepository.updateReportById(reportId, params);


    if (status === ReportStatusEnum.APPROVED) {
      const { price_id } = await this.reportRepository.readReportById(reportId);

      await this.priceService.updateModeratedFlag(price_id, true);
    }

    return this.toReportDto(updatedReport);
  }

  private toReportDto(report: any): ReportDto {
  const price = report.prices;

  return {
    id: report.id,
    reason: report.reason,
    resolved: report.resolved,
    userId: report.user_id,
    status: report.status,
    price: {
      id: price.id,
      price: price.price,
      imageUrl: price.image_url,
      moderated: price.moderated,
      userId: price.user_id,
      product: {
        id: price.product.id,
        name: price.product.name,
        category: price.product.category,
        description: price.product.description,
      },
      market: {
        id: price.market.id,
        name: price.market.name,
        city: price.market.city,
        state: price.market.state,
        address: price.market.address,
      },
    },
  };
}

}
