import { inngest, deadlineMonitor } from './deadline-monitor'
import { statusChecker } from './status-checker'

export const inngestFunctions = [deadlineMonitor, statusChecker]
export { inngest }
