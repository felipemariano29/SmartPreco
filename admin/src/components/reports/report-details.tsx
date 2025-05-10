/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { type ReportDto } from "@/api/generated/smartPreçoAPI.schemas"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"

interface ReportDetailsProps {
  report: ReportDto | null
  onClose: () => void
  onApprove: (report: ReportDto) => void
  onReject: (report: ReportDto) => void
}

export function ReportDetails({ report, onClose, onApprove, onReject }: ReportDetailsProps) {
  if (!report) return null

  return (
    <Dialog open={!!report} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>Detailed information about the selected report.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Report ID:</div>
                <div className="col-span-3 font-mono text-sm">{report.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Price ID:</div>
                <div className="col-span-3 font-mono text-sm">{report.price.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Product:</div>
                <div className="col-span-3">{report.price.product.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Market:</div>
                <div className="col-span-3">{report.price.market.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Price:</div>
                <div className="col-span-3">R$ {report.price.price.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  {report.resolved ? (
                    <Badge className="bg-green-100 text-green-800">{report.status}</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  // src={report.price.imageUrl ?? ""}
                  src={"/placeholder.jpg"}
                  alt={`${report.price.product.name} at ${report.price.market.name}`}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Image provided by the user for price verification
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Report Reason:</div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="whitespace-pre-wrap text-sm">{report.reason}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Market Details:</div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm">
                {report.price.market.name} - {report.price.market.address}
                <br />
                {report.price.market.city}, {report.price.market.state}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {!report.resolved && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-red-200 bg-red-100 text-red-800 hover:bg-red-200"
                onClick={() => onReject(report)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                className="border-green-200 bg-green-100 text-green-800 hover:bg-green-200"
                onClick={() => onApprove(report)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 