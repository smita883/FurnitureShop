'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductGrid } from '@/components/product-grid';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/db';
import { sampleProducts } from '@/lib/seed-data';
import { db } from '@/lib/db';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load products from localStorage or use sample products
    try {
      const stored = localStorage.getItem('furniture_products');
      if (stored) {
        const products = JSON.parse(stored);
        db.setProducts(products);
        setProducts(products);
      } else {
        // Initialize with sample products on first visit
        db.setProducts(sampleProducts);
        localStorage.setItem('furniture_products', JSON.stringify(sampleProducts));
        setProducts(sampleProducts);
      }
    } catch (error) {
      // Fallback to sample products if localStorage fails
      db.setProducts(sampleProducts);
      setProducts(sampleProducts);
    }
    setLoading(false);
  }, []);

  const categories = ['Dining', 'Bedroom', 'Office', 'Living Room', 'Storage', 'Decor'];
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Handcrafted Wooden Furniture
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Discover our collection of premium, handcrafted furniture that combines traditional techniques with modern design. Each piece is made with care and finest materials.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 flex-1 w-full">
        {/* Featured Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Featured Products
            </h2>
            <Link href="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {!loading && <ProductGrid products={featuredProducts} />}
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="relative group"
              >
                <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16 bg-card border border-border rounded-lg p-8 md:p-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mb-4">
                <span className="text-xl font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Handcrafted Quality</h3>
              <p className="text-muted-foreground">
                Each piece is carefully crafted by skilled artisans using traditional techniques passed down through generations.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-accent-foreground mb-4">
                <span className="text-xl font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Custom Design</h3>
              <p className="text-muted-foreground">
                Customize colors, sizes, and materials to match your unique style and home décor perfectly.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground mb-4">
                <span className="text-xl font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Premium Materials</h3>
              <p className="text-muted-foreground">
                We use only the finest wood and eco-friendly finishes to ensure durability and beauty that lasts.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-16 bg-gradient-to-r from-primary/10 to-accent/10 border border-border rounded-lg p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-muted-foreground mb-6">
              Get exclusive updates on new collections, special offers, and design inspiration delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
