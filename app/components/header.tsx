'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, ShoppingBagIcon, ShoppingBag, Shirt, ShirtIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/app/components/cart-context'
import { ClerkLoaded, UserButton, useUser } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'

export default function Header() {
  const {user} = useUser()
  const { getCartCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed py-2 sm:py-4 top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled 
        ? 'bg-beige-100/80 backdrop-blur-sm shadow-md' 
        : 'bg-beige-100'
      }`}>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-beige-800">
            Becky in Japan
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
            <Link href="/products">
              <Button variant="outline" size="icon" className="text-beige-800 border-beige-300">
                <ShirtIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button variant="outline" size="icon" className="text-beige-800 border-beige-300 relative">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-beige-400 text-beige-50 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </Link>

            <ClerkLoaded>
              {user && (
                <Link href="/order">
                  <Button variant="outline" size="icon" className="text-beige-800 border-beige-300">
                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5"/>
                  </Button>
                </Link>
              )}

              {user ? (
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 sm:w-10 sm:h-10",
                      userButtonTrigger: "focus:shadow-none focus:ring-2 focus:ring-beige-300 rounded-full"
                    }
                  }}
                />
              ) : (
                <Button variant="outline" size="sm" className="text-sm sm:text-base" asChild>
                  <SignInButton mode="modal"/>
                </Button>
              )}
            </ClerkLoaded>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            <Link href="/products">
              <Button variant="outline" size="icon" className="text-beige-800 border-beige-300">
                <ShirtIcon className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="outline" size="icon" className="text-beige-800 border-beige-300 relative">
                <ShoppingCart className="h-4 w-4" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-beige-400 text-beige-50 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="outline"
              size="icon"
              className="text-beige-800 border-beige-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 py-2 border-t border-beige-200">
            <nav className="flex flex-col space-y-2">
              {user && (
                <Link href="/order" className="px-2 py-1 text-beige-700 hover:text-beige-800">
                  My Orders
                </Link>
              )}
              <div className="px-2">
                <ClerkLoaded>
                  {user ? (
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-8 h-8",
                          userButtonTrigger: "focus:shadow-none focus:ring-2 focus:ring-beige-300 rounded-full"
                        }
                      }}
                    />
                  ) : (
                    <Button variant="outline" size="sm" className="w-full text-sm" asChild>
                      <SignInButton mode="modal"/>
                    </Button>
                  )}
                </ClerkLoaded>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

