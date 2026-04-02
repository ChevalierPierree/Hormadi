import type { Metadata } from 'next'
import { Anton, Inter } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/cart'

const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
  weight: '400',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hormadi Anglet — Hockey sur Glace',
    template: '%s | Hormadi Anglet',
  },
  description:
    'Site officiel de l\'Hormadi Anglet Pays Basque — Hockey sur glace en Ligue Magnus. Billetterie, boutique, actualités et calendrier des matchs.',
  keywords: [
    'Hormadi', 'Anglet', 'hockey sur glace', 'Ligue Magnus',
    'Pays Basque', 'billetterie', 'ice hockey',
  ],
  openGraph: {
    title: 'Hormadi Anglet — Hockey sur Glace',
    description: 'Site officiel de l\'Hormadi Anglet Pays Basque',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${anton.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/images/logo-hormadi.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo-hormadi.png" />
      </head>
      <body className="font-sans">
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-[5.5rem]">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
