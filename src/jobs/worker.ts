import { inngestFunctions } from './inngest.config'

console.log('[Inngest Worker] Starting AuthPilot background job runner worker...')
console.log(
  '[Inngest Worker] Active Inngest cron jobs registered:',
  inngestFunctions.map((f) => f.id).join(', ')
)
