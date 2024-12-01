import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/header'
import Footer from './components/footer'
import { CartProvider } from './components/cart-context'
import { ClerkProvider } from '@clerk/nextjs'
import clerkAppearance from '@/components/ui/clerkui'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Becky in Japan',
  description: 'Buy Japanese products from Becky in Japan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-beige-50 text-beige-900`}>
        <ClerkProvider appearance={clerkAppearance}>
          <CartProvider>
            <Header />
            <main className="pt-[72px]">{children}</main>
            <Footer />
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}

