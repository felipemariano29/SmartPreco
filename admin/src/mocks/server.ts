import { getReportMock } from "@/api/generated/report/report.msw"
import { setupServer } from "msw/node"

export const server = setupServer(...getReportMock())
