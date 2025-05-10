"use client"

import { useReadReports } from "@/api/generated/report/report"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function AdminDashboard() {
  const { data } = useReadReports()
  const reports = data?.data?.reports ?? []

  const totalReports = reports.length
  const resolvedReports = reports.filter((report) => report.resolved || report.status ).length
  const pendingReports = totalReports - resolvedReports
  const approvedReports = reports.filter((report) => report.status === "APPROVED").length
  const rejectedReports = reports.filter((report) => report.status === "REJECTED").length

  return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your admin dashboard</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReports}</div>
              <p className="text-xs text-muted-foreground">All time reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Reports</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedReports}</div>
              <p className="text-xs text-muted-foreground">
                {((resolvedReports / totalReports) * 100).toFixed(1)}% resolution rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReports}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalReports > 0
                  ? ((approvedReports / totalReports) * 100).toFixed(1)
                  : "0"}%
              </div>
              <p className="text-xs text-muted-foreground">
                {approvedReports} approved / {rejectedReports} rejected / {pendingReports} pending
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common actions you can take</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Review Reports</CardTitle>
                  <CardDescription>Check and manage pending reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="/admin/reports"
                    className="text-sm text-primary hover:underline"
                  >
                    Go to Reports →
                  </a>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
