/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import { useReadReports, useUpdateReport } from "@/api/generated/report/report";
import {
  type ReportDto,
  ReportUpdateDtoStatus,
} from "@/api/generated/smartPreçoAPI.schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ReportDetails } from "@/components/reports/report-details";
import { ChevronDown, Eye, Filter, MoreHorizontal, Search } from "lucide-react";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<ReportDto | null>(null);

  const { data, isLoading, refetch } = useReadReports();
  const updateReportMutation = useUpdateReport({
    mutation: {
      onSuccess: () => {
        toast.success("Report updated", {
          description: "The report status has been updated successfully.",
        });
        void refetch();
        setSelectedReport(null);
      },
      onError: () => {
        toast.error("Error", {
          description: "Failed to update report status. Please try again.",
        });
      },
    },
  });

  const reports = data?.data?.reports ?? [];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      report.price?.id?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      report.reason?.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "resolved") return matchesSearch && report.resolved;
    if (statusFilter === "unresolved") return matchesSearch && !report.resolved;

    return matchesSearch;
  });

  const handleApproveReport = (report: ReportDto) => {
    updateReportMutation.mutate({
      reportId: report.id ?? "",
      data: {
        resolved: true,
        status: ReportUpdateDtoStatus.APPROVED,
      },
    });
  };

  const handleRejectReport = (report: ReportDto) => {
    updateReportMutation.mutate({
      reportId: report.id ?? "",
      data: {
        resolved: true,
        status: ReportUpdateDtoStatus.REJECTED,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports Management</h1>
            <p className="mt-1 text-muted-foreground">
              Review and manage price reports submitted by users
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>
                  Resolved Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("unresolved")}>
                  Unresolved Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              {filteredReports.length}{" "}
              {filteredReports.length === 1 ? "report" : "reports"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Price ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No reports found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id ?? ""}>
                        <TableCell className="font-medium">
                          {report.id?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {report.price?.id?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{report.price?.product?.name}</TableCell>
                        <TableCell>{report.price?.market?.name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {report.reason}
                        </TableCell>
                        <TableCell>
                          {report.resolved ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              {report.status}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                            >
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <ReportDetails
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onApprove={handleApproveReport}
        onReject={handleRejectReport}
      />
    </>
  );
}
