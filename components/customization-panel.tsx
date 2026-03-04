'use client';

import { useState } from 'react';
import { Product } from '@/lib/db';
import { Button } from '@/components/ui/button';

interface CustomizationPanelProps {
  product: Product;
  onAddToCart: (customization: any) => void;
}

export function CustomizationPanel({ product, onAddToCart }: CustomizationPanelProps) {
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(product.materials[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({
      color: selectedColor,
      size: selectedSize,
      material: selectedMaterial,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Color Selection */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Color: <span className="text-primary">{selectedColor}</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {product.colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-3 py-2 rounded border-2 transition-all ${
                selectedColor === color
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary'
              } text-sm font-medium text-foreground`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Material Selection */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Material: <span className="text-primary">{selectedMaterial}</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {product.materials.map(material => (
            <button
              key={material}
              onClick={() => setSelectedMaterial(material)}
              className={`px-3 py-2 rounded border-2 transition-all ${
                selectedMaterial === material
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary'
              } text-sm font-medium text-foreground`}
            >
              {material}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Size: <span className="text-primary">{selectedSize}</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 py-2 rounded border-2 transition-all ${
                selectedSize === size
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary'
              } text-sm font-medium text-foreground`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Quantity
        </label>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-muted transition-colors text-foreground"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="flex-1 border-0 bg-background text-center text-foreground focus:outline-none focus:ring-0"
            min="1"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 hover:bg-muted transition-colors text-foreground"
          >
            +
          </button>
        </div>
      </div>

      {/* Price and CTA */}
      <div className="border-t border-border pt-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Total Price</p>
          <p className="text-3xl font-serif font-bold text-primary">
            ₹{(product.price * quantity).toLocaleString()}
          </p>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-3 font-semibold transition-all ${
            addedToCart
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-primary hover:bg-primary/90'
          } text-primary-foreground`}
        >
          {addedToCart ? '✓ Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>

      {/* Availability */}
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Availability:</span>{' '}
          <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Estimated delivery: 7-10 business days
        </p>
      </div>
    </div>
  );
}
