'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/db';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group relative flex flex-col bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-64 bg-muted overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-serif text-lg text-card-foreground hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="ml-2 flex-shrink-0"
          >
            <Heart
              size={20}
              className={isWishlisted ? 'fill-accent text-accent' : 'text-muted-foreground'}
            />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-accent text-accent" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="mt-auto">
          <div className="mb-4">
            <p className="text-2xl font-serif text-primary">
              ₹{product.price.toLocaleString()}
            </p>
          </div>
          <Link href={`/products/${product.id}`} className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
