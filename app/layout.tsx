import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { ExitModal } from '@/components/modals/ExitModal'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Duo Lingo',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={nunito.className}>
          <Toaster />
          <ExitModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
