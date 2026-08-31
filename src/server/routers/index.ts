import { router } from '../trpc'
import { authorizationRouter } from './authorization'
import { analyticsRouter } from './analytics'

export const appRouter = router({
  authorization: authorizationRouter,
  analytics: analyticsRouter,
})

export type AppRouter = typeof appRouter
