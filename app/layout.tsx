import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Atom Eco Store - Sustainable Living',
  description: 'Your one-stop destination for eco-friendly and sustainable products.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
          id="razorpay-script"
        />
      </head>
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
