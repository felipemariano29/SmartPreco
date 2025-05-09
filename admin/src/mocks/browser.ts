import { getReportMock } from "@/api/generated/report/report.msw"
import { setupWorker } from "msw/browser"

export const worker = setupWorker(...getReportMock()) 
