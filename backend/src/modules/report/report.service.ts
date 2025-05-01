import { Injectable } from '@nestjs/common';

import { ReportCreateDto, ReportDto, ReportsDto, ReportUpdateDto } from './report.dto';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {

  public constructor(private readonly reportRepository: ReportRepository) {}

  public createReport(params: ReportCreateDto): Promise<ReportDto> {
    return this.reportRepository.createReport(params);
  }

  public async readReports(): Promise<ReportsDto> {
    const reports = await this.reportRepository.readReports();

    return { reports };
  }

  public updateReportById(reportId: string, params: ReportUpdateDto): Promise<ReportDto> {
    return this.reportRepository.updateReportById(reportId, params);
  }

}
