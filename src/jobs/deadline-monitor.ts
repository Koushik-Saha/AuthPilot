import { Inngest } from 'inngest'
import { query } from '@/lib/db'

export const inngest = new Inngest({ id: 'authpilot-jobs' })

/**
 * Daily Inngest Cron Job: Monitors authorizations expiring within 30 days.
 * Triggers automated coordinator alerts.
 */
export const deadlineMonitor = (inngest as any).createFunction(
  { id: 'deadline-monitor' },
  { cron: '0 14 * * *' },
  async ({ step }: { step: any }) => {
    const expiringAuths = await step.run('fetch-expiring-authorizations', async () => {
      return await query<any>(
        `SELECT a.id, a.patient_id, a.auth_end_date, p.medicaid_id 
         FROM public.authorizations a
         JOIN public.patients p ON a.patient_id = p.id
         WHERE a.status = 'approved' 
           AND a.auth_end_date < NOW() + INTERVAL '30 days'
           AND a.auth_end_date > NOW()`
      )
    })

    for (const auth of expiringAuths) {
      await step.run(`notify-expiry-${auth.id}`, async () => {
        if (process.env.MAILTRAP_TOKEN) {
          await fetch('https://send.api.mailtrap.io/api/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.MAILTRAP_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: { email: 'notifications@authpilot.com', name: 'AuthPilot Deadline Monitor' },
              to: [{ email: 'coordinator@agency.com' }],
              subject: `⚠️ Authorization Expiring in <30 Days — Member ID ending in ...${auth.medicaid_id?.slice(-4)}`,
              text: `Authorization ${auth.id} expires on ${auth.auth_end_date}. Please trigger renewal flow in AuthPilot.`,
            }),
          })
        }
      })
    }

    return { processed_count: expiringAuths.length }
  }
)
