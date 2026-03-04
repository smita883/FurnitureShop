'use client';

import { Product } from '@/lib/db';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: Product[];
  category?: string;
}

export function ProductGrid({ products, category }: ProductGridProps) {
  const filteredProducts = category
    ? products.filter(p => p.category === category)
    : products;

  if (filteredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
