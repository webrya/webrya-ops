import { Inter } from 'next/font/google'
import './globals.css'
import { clsx } from 'clsx'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Webrya Ops',
  description: 'Mobile-first Property Management SaaS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={clsx(inter.className, "bg-background text-foreground")}>
        {children}
      </body>
    </html>
  )
}