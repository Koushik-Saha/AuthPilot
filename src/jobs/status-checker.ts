import { inngest } from './deadline-monitor'
import { query } from '@/lib/db'

/**
 * 4-Hour Inngest Cron Job: Checks pending submissions with no response after 2+ days.
 */
export const statusChecker = (inngest as any).createFunction(
  { id: 'status-checker' },
  { cron: '0 */4 * * *' },
  async ({ step }: { step: any }) => {
    const staleSubmissions = await step.run('fetch-stale-submissions', async () => {
      return await query<any>(
        `SELECT a.id, a.submitted_at, s.twilio_sid, s.status AS sub_status 
         FROM public.authorizations a
         JOIN public.submissions s ON s.authorization_id = a.id
         WHERE a.status = 'submitted' 
           AND a.submitted_at < NOW() - INTERVAL '2 days'`
      )
    })

    for (const sub of staleSubmissions) {
      await step.run(`alert-stale-pa-${sub.id}`, async () => {
        if (process.env.MAILTRAP_TOKEN) {
          await fetch('https://send.api.mailtrap.io/api/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.MAILTRAP_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: { email: 'notifications@authpilot.com', name: 'AuthPilot Status Checker' },
              to: [{ email: 'coordinator@agency.com' }],
              subject: `⏳ Pending PA Needs Follow-Up — Submitted >2 Days Ago [Auth ID: ${sub.id}]`,
              text: `Authorization ${sub.id} was submitted on ${sub.submitted_at}. Payer has not acknowledged receipt. Please follow up directly.`,
            }),
          })
        }
      })
    }

    return { checked_count: staleSubmissions.length }
  }
)
