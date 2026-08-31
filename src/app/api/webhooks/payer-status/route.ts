import { NextResponse } from 'next/server'
import { handleFaxStatusWebhook } from '@/submission/fax'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const payload: Record<string, any> = {}

    formData.forEach((value, key) => {
      payload[key] = value.toString()
    })

    await handleFaxStatusWebhook(payload)

    return new NextResponse('<Response></Response>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    })
  } catch (err: any) {
    console.error('[Webhook Error]:', err?.message || err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
