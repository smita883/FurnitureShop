'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/db';
import { db } from '@/lib/db';
import { ArrowLeft, X } from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productIds = searchParams.get('products')?.split(',') || [];
    const comparisonProducts = productIds
      .map(id => db.getProductById(id))
      .filter((p): p is Product => p !== undefined);
    setProducts(comparisonProducts);
    setLoading(false);
  }, [searchParams]);

  const removeProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading comparison...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 flex-1 w-full py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              No Products to Compare
            </h1>
            <p className="text-muted-foreground mb-8">
              Please select products from your wishlist to compare
            </p>
            <Link href="/wishlist">
              <Button className="gap-2">
                <ArrowLeft size={18} />
                Back to Wishlist
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-full mx-auto px-4 flex-1 w-full py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl font-bold text-foreground">
            Compare Products
          </h1>
          <Link href="/wishlist">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={18} />
              Back
            </Button>
          </Link>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto bg-card border border-border rounded-lg">
          <table className="w-full">
            {/* Header with product images */}
            <thead>
              <tr className="border-b border-border">
                <th className="p-6 text-left font-semibold text-foreground bg-muted sticky left-0 z-10 w-48">
                  Specification
                </th>
                {products.map(product => (
                  <th key={product.id} className="p-6 text-center min-w-96 relative">
                    <div className="relative">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute top-0 right-0 p-1 hover:bg-muted rounded transition-colors"
                      >
                        <X size={20} className="text-muted-foreground" />
                      </button>
                      <Link href={`/products/${product.id}`}>
                        <div className="relative w-full h-48 bg-muted rounded overflow-hidden mb-4">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </Link>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Comparison Rows */}
            <tbody>
              {/* Price */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-6 font-semibold text-foreground bg-muted sticky left-0 z-10 w-48">
                  Price
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-6 text-center min-w-96">
                    <p className="text-2xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-6 font-semibold text-foreground bg-muted sticky left-0 z-10 w-48">
                  Category
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-6 text-center min-w-96 text-foreground">
                    {product.category}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-6 font-semibold text-foreground bg-muted sticky left-0 z-10 w-48">
                  Rating
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-6 text-center min-w-96">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-bold text-foreground">{product.rating}</span>
                      <span className="text-accent">★</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Materials */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-6 font-semibold text-foreground bg-muted sticky left-0 z-10 w-48">
                  Materials
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-6 text-center min-w-96">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {product.materials.map(material => (
                        <span
                          key={material}
                          className="px-3 py-1 bg-primary/10 text-primary rounded text-sm"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Colors */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-6 font-semibold text-foreground bg-muted sticky left-0 z-10 w-48">
                  Colors
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-6 text-center min-w-96">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {product.colors.map(color => (
                        <span
                          key={color}
                          className="px-3 py-1 bg-accent/10 text-accent rounded text-sm"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Sizes */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-6 font-semibold text-foreground bg-muted sticky left-0 z-10 w-48">
                  Available Sizes
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-6 text-center min-w-96">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {product.sizes.map(size => (
                        <span
                          key={size}
                          className="px-3 py-1 bg-secondary/10 text-secondary rounded text-sm"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Stock Status */}
              <tr className="hover:bg-muted/50">
                <td className="p-6 font-semibold text-foreground bg-muted sticky left-0 z-10 w-48">
                  Availability
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-6 text-center min-w-96">
                    <span
                      className={`px-3 py-1 rounded font-medium text-sm ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Button className="bg-primary hover:bg-primary/90">
                View {product.name}
              </Button>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CompareContent />
    </Suspense>
  );
}
