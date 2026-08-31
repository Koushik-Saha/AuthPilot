import { NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { planId, agencyId } = body

    const plan = PLANS[planId] || PLANS.growth
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AuthPilot ${plan.name}`,
              description: `Monthly prior authorization software subscription (${plan.pa_limit ? plan.pa_limit + ' PAs/mo' : 'Unlimited PAs'})`,
            },
            unit_amount: plan.amount * 100,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/billing?success=true`,
      cancel_url: `${baseUrl}/billing?canceled=true`,
      client_reference_id: agencyId,
      metadata: { agencyId, planId },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[Stripe Checkout Error]:', err?.message || err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
