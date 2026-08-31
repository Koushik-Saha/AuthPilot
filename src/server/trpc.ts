import { initTRPC, TRPCError } from '@trpc/server'
import { logAuditEvent } from '@/lib/audit-log'

export interface Context {
  user: { id: string; email: string } | null
  agencyId: string | null
}

export const createContext = async (): Promise<Context> => {
  // Extract user session and agency context from request session
  return {
    user: { id: 'usr-123', email: 'coordinator@agency.com' },
    agencyId: 'agency-1',
  }
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

/**
 * Protected Procedure Middleware: Requires authenticated session.
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this prior authorization action.',
    })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

/**
 * Agency Procedure Middleware: Enforces active agency context.
 */
export const agencyProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.agencyId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Active agency ID context is required.',
    })
  }
  return next({
    ctx: {
      agencyId: ctx.agencyId,
    },
  })
})

/**
 * Automated Audit Logging Middleware for Mutations.
 */
export const auditedProcedure = agencyProcedure.use(async ({ ctx, next, type, path }) => {
  const result = await next()

  // Automatically log all mutation actions for HIPAA compliance
  if (type === 'mutation') {
    await logAuditEvent({
      action: `trpc_mutation:${path}`,
      resourceType: 'trpc_procedure',
      resourceId: path,
      agencyId: ctx.agencyId,
      userId: ctx.user.id,
    })
  }

  return result
})
