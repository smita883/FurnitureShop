'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, CartItem as CartItemType } from '@/lib/db';

interface CartItemProps {
  item: CartItemType;
  product: Product;
  onRemove: (productId: string, customization: any) => void;
  onQuantityChange: (productId: string, customization: any, quantity: number) => void;
}

export function CartItem({ item, product, onRemove, onQuantityChange }: CartItemProps) {
  if (!product) return null;

  const itemTotal = product.price * item.quantity;

  return (
    <div className="flex gap-4 border-b border-border pb-6 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24">
        <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-foreground mb-2">
          {product.name}
        </h3>
        
        <div className="text-sm text-muted-foreground space-y-1 mb-3">
          {item.customization.color && (
            <p>Color: <span className="text-foreground font-medium">{item.customization.color}</span></p>
          )}
          {item.customization.material && (
            <p>Material: <span className="text-foreground font-medium">{item.customization.material}</span></p>
          )}
          {item.customization.size && (
            <p>Size: <span className="text-foreground font-medium">{item.customization.size}</span></p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(product.id, item.customization, Math.max(1, item.quantity - 1))}
              className="px-2 py-1 hover:bg-muted rounded text-foreground"
            >
              −
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => onQuantityChange(product.id, item.customization, Math.max(1, Number(e.target.value)))}
              className="w-12 text-center border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
            />
            <button
              onClick={() => onQuantityChange(product.id, item.customization, item.quantity + 1)}
              className="px-2 py-1 hover:bg-muted rounded text-foreground"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(product.id, item.customization)}
            className="p-2 hover:bg-destructive/10 rounded text-destructive transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex flex-col justify-between">
        <p className="text-sm text-muted-foreground">
          ₹{product.price.toLocaleString()}
        </p>
        <p className="font-semibold text-foreground text-lg">
          ₹{itemTotal.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
