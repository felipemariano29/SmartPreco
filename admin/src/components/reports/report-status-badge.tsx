import { ReportDtoStatus } from "@/api/generated/smartPreçoAPI.schemas"
import { Badge } from "@/components/ui/badge"

interface ReportStatusBadgeProps {
  status: ReportDtoStatus | undefined
  resolved?: boolean
}

export function ReportStatusBadge({ status, resolved }: ReportStatusBadgeProps) {
  if (status === ReportDtoStatus.APPROVED) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        {status}
      </Badge>
    )
  }

  if (status === ReportDtoStatus.REJECTED) {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
        REJECTED
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
      PENDING
    </Badge>
  )
} 