import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { query } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event: any

  try {
    if (webhookSecret && !webhookSecret.includes('your_stripe')) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      event = JSON.parse(body)
    }
  } catch (err: any) {
    console.error('[Stripe Webhook Signature Verification Failed]:', err?.message || err)
    return NextResponse.json({ error: `Webhook Error: ${err?.message}` }, { status: 400 })
  }

  // Handle Stripe Webhook Events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const agencyId = session.metadata?.agencyId || session.client_reference_id
        const planId = session.metadata?.planId || 'growth'
        const stripeCustomerId = session.customer

        if (agencyId) {
          await query(
            `UPDATE public.agencies 
             SET plan = $1, stripe_customer_id = $2, updated_at = NOW() 
             WHERE id = $3`,
            [planId, stripeCustomerId, agencyId]
          )
        }
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const stripeCustomerId = subscription.customer
        const planId = subscription.metadata?.planId || 'growth'

        await query(
          `UPDATE public.agencies 
           SET plan = $1, updated_at = NOW() 
           WHERE stripe_customer_id = $2`,
          [planId, stripeCustomerId]
        )
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const stripeCustomerId = subscription.customer

        // Downgrade to starter / free plan on cancellation
        await query(
          `UPDATE public.agencies 
           SET plan = 'starter', updated_at = NOW() 
           WHERE stripe_customer_id = $1`,
          [stripeCustomerId]
        )
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Stripe Webhook Handler Error]:', err?.message || err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
