import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2023-10-16' as any,
})

export interface PlanConfig {
  id: string
  name: string
  priceId: string
  amount: number
  pa_limit: number | null
}

export const PLANS: Record<string, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter Plan',
    priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter_dummy',
    amount: 299,
    pa_limit: 30,
  },
  growth: {
    id: 'growth',
    name: 'Growth Plan',
    priceId: process.env.STRIPE_PRICE_GROWTH || 'price_growth_dummy',
    amount: 599,
    pa_limit: 150,
  },
  complete: {
    id: 'complete',
    name: 'Complete Plan',
    priceId: process.env.STRIPE_PRICE_COMPLETE || 'price_complete_dummy',
    amount: 899,
    pa_limit: null, // Unlimited
  },
}
