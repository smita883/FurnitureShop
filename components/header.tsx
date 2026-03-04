'use client';

import Link from 'next/link';
import { ShoppingCart, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cartStorage, userStorage } from '@/lib/storage';
import { useEffect, useState } from 'react';

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const cart = cartStorage.get();
    setCartCount(cart.length);

    const currentUser = userStorage.get();
    setUser(currentUser);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-serif font-bold text-lg">
            VF
          </div>
          <span className="text-xl font-serif font-bold text-primary hidden sm:inline">
            Vishwakarma Furniture
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/chat">
            <Button variant="ghost" size="icon">
              <MessageCircle size={20} />
            </Button>
          </Link>
          
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href={user ? '/account' : '/login'}>
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </Link>

          <Link href="/admin" className="hidden sm:block">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
