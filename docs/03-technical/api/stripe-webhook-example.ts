// Example Stripe Webhook (Node runtime, not Edge)
// Place under Next.js: app/api/webhooks/stripe/route.ts (runtime: nodejs)

import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

export const config = { runtime: 'nodejs' } as const

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  let event: Stripe.Event
  const buf = Buffer.from(await req.arrayBuffer())

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'invoice.payment_succeeded':
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      // TODO: handle subscription lifecycle (monthly points accrual)
      // - invoice.payment_succeeded: créditer points mensuels et avancer la date de facturation
      break
    default:
      // no-op
      break
  }

  return NextResponse.json({ received: true })
}
