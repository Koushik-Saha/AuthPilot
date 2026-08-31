import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { stripeCustomerId } = body

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    if (!stripeCustomerId) {
      return NextResponse.json({ url: `${baseUrl}/billing` })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[Stripe Portal Error]:', err?.message || err)
    return NextResponse.json({ error: 'Failed to create customer portal session' }, { status: 500 })
  }
}
