import { supabaseAdmin } from './supabase'

export interface LogAuditEventParams {
  action: string
  resourceType: string
  resourceId: string
  userId?: string | null
  agencyId?: string | null
  request?: Request | null
  ipAddress?: string | null
  userAgent?: string | null
}

/**
 * Log a HIPAA-compliant audit event to the immutable audit_log table.
 * Guaranteed to never throw errors to ensure main application execution is never disrupted.
 */
export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
  try {
    let ipAddress = params.ipAddress || null
    let userAgent = params.userAgent || null

    if (params.request) {
      const req = params.request
      if ('headers' in req && typeof req.headers.get === 'function') {
        ipAddress =
          req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
          req.headers.get('x-real-ip') ||
          ipAddress

        userAgent = req.headers.get('user-agent') || userAgent
      }
    }

    const { error } = await supabaseAdmin.from('audit_log').insert({
      agency_id: params.agencyId || null,
      user_id: params.userId || null,
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (error) {
      console.error('[HIPAA Audit Log] Failed to write audit record:', error.message)
    }
  } catch (err) {
    console.error('[HIPAA Audit Log] Exception caught while logging audit event:', err)
  }
}
