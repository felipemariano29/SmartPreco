  import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { ReportCreateRepositoryDto, ReportReadDto, ReportRepositoryDto, ReportsTimestampDto, ReportUpdateDto } from "./report.dto";

  @Injectable()
  export class ReportRepository {
    private readonly selectFields = `
      *,
      prices (
        *,
        product:products (*),
        market:markets (*)
      )
    `;

    public constructor(private readonly supabase: SupabaseClient) {}

    public async createReport(params: ReportCreateRepositoryDto): Promise<ReportRepositoryDto> {
      const { data: report, error: reportError } = await this.supabase
        .from('reports')
        .insert({ ...params, resolved: false })
        .select(this.selectFields)
        .single();

      if (reportError) throw new BadRequestException(reportError.message);

      return report;
    }

    public async readReports(params: ReportReadDto): Promise<ReportsTimestampDto> {
      const { search, limit = 20, offset = 0, orderBy, resolved } = params;

      let query = this.supabase
        .from('reports')
        .select(this.selectFields, { count: 'exact' });

      if (resolved !== undefined) {
        query = query.eq('resolved', resolved);
      }

      if (search) {
        query = query.or(`reason.ilike.%${search}%`);
      }

      if (orderBy) {
        query = query.order(orderBy, { ascending: true });
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error, count: total } = await query;

      if (error) {
        throw new BadRequestException(error.message);
      }

      return {
        records: data,
        total: total ?? 0,
      };
    }

    public async updateReportById(reportId: string, dto: ReportUpdateDto): Promise<ReportRepositoryDto> {
      const { data, error } = await this.supabase
        .from('reports')
        .update(dto)
        .eq('id', reportId)
        .select(this.selectFields)
        .single();

      if (error) throw new BadRequestException(error.message);

      return data;
    }
  }