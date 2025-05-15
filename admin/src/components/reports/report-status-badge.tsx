import { ReportDtoStatus } from "@/api"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

interface ReportStatusBadgeProps {
  status: ReportDtoStatus | undefined
  resolved?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ReportStatusBadge({ status, resolved }: ReportStatusBadgeProps) {
  const t = useTranslations();
  
  if (status === ReportDtoStatus.APPROVED) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        {t("reports.status.approved")}
      </Badge>
    )
  }

  if (status === ReportDtoStatus.REJECTED) {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
        {t("reports.status.rejected")}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
      {t("reports.status.pending")}
    </Badge>
  )
} 