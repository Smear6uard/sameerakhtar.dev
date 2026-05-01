import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

function RouteNotFound() {
  return null
}

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultNotFoundComponent: RouteNotFound,
    scrollRestoration: true,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
