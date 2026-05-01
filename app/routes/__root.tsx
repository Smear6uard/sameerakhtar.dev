/// <reference types="vite/client" />

import type { ReactNode } from 'react'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

import { AppShell } from '@/components/layout/AppShell'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { themeInitScript } from '@/lib/theme'

import appCss from '../styles/global.css?url'

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: 'icon', href: '/logo.png', type: 'image/png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'stylesheet', href: appCss },
    ],
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'description',
        content: 'Portfolio of Sameer Akhtar.',
      },
      { title: 'Sameer Akhtar' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider>
        <AppShell>
          <Outlet />
        </AppShell>
      </ThemeProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
