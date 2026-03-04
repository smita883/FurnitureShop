'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartItem } from '@/components/cart-item';
import { Button } from '@/components/ui/button';
import { Product, CartItem as CartItemType } from '@/lib/db';
import { cartStorage } from '@/lib/storage';
import { db } from '@/lib/db';
import { sampleProducts } from '@/lib/seed-data';
import { ArrowRight } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('furniture_products');
      const allProducts = stored ? JSON.parse(stored) : sampleProducts;
      db.setProducts(allProducts);
      setProducts(allProducts);
      const cart = cartStorage.get();
      setCartItems(cart);
    } catch (error) {
      db.setProducts(sampleProducts);
      setProducts(sampleProducts);
      setCartItems(cartStorage.get());
    }
    setLoading(false);
  }, []);

  const handleRemoveItem = (productId: string, customization: any) => {
    const updated = cartStorage.remove(productId, customization);
    setCartItems(updated);
  };

  const handleQuantityChange = (productId: string, customization: any, newQuantity: number) => {
    const updated = cartItems.map(item => {
      if (item.productId === productId && JSON.stringify(item.customization) === JSON.stringify(customization)) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updated);
    cartStorage.set(updated);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = subtotal > 0 ? 500 : 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 flex-1 w-full py-8">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg">
            <p className="text-xl text-muted-foreground mb-6">Your cart is empty</p>
            <Link href="/products">
              <Button className="gap-2">
                Continue Shopping
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="space-y-6">
                  {cartItems.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return product ? (
                      <CartItem
                        key={item.id}
                        item={item}
                        product={product}
                        onRemove={handleRemoveItem}
                        onQuantityChange={handleQuantityChange}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Order Summary
                </h2>

                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground text-lg">Total</span>
                  <span className="font-serif font-bold text-2xl text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <Link href="/checkout" className="w-full block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/products" className="w-full block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>

                <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                  <p>✓ Free shipping on orders above ₹10,000</p>
                  <p>✓ 30-day return policy</p>
                  <p>✓ Secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
