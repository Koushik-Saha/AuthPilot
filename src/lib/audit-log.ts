import { query } from './db'

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
 * Log a HIPAA-compliant audit event to the immutable audit_log table in Neon PostgreSQL.
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

    await query(
      `INSERT INTO public.audit_log (agency_id, user_id, action, resource_type, resource_id, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        params.agencyId || null,
        params.userId || null,
        params.action,
        params.resourceType,
        params.resourceId,
        ipAddress,
        userAgent,
      ]
    )
  } catch (err: any) {
    console.error('[HIPAA Audit Log] Exception caught while logging audit event:', err?.message || err)
  }
}
