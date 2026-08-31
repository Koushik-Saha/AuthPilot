import { router } from '../trpc'
import { authorizationRouter } from './authorization'

export const appRouter = router({
  authorization: authorizationRouter,
})

export type AppRouter = typeof appRouter
