'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Product, Wishlist } from '@/lib/db';
import { db } from '@/lib/db';
import { userStorage, cartStorage } from '@/lib/storage';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [wishlistItems, setWishlistItems] = useState<Wishlist[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = userStorage.get();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    const items = db.getWishlist(currentUser.id);
    setWishlistItems(items);

    const products = items
      .map(item => db.getProductById(item.productId))
      .filter((p): p is Product => p !== undefined);
    setWishlistProducts(products);
    setLoading(false);
  }, [router]);

  const handleRemoveFromWishlist = (productId: string) => {
    if (user) {
      db.removeFromWishlist(user.id, productId);
      setWishlistItems(wishlistItems.filter(w => w.productId !== productId));
      setWishlistProducts(wishlistProducts.filter(p => p.id !== productId));
      setSelectedForComparison(selectedForComparison.filter(id => id !== productId));
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: Date.now().toString(),
      productId: product.id,
      quantity: 1,
      customization: {
        color: product.colors[0],
        size: product.sizes[0],
        material: product.materials[0],
      },
      price: product.price,
    };
    cartStorage.add(cartItem);
    alert('Added to cart!');
  };

  const toggleComparison = (productId: string) => {
    if (selectedForComparison.includes(productId)) {
      setSelectedForComparison(selectedForComparison.filter(id => id !== productId));
    } else {
      setSelectedForComparison([...selectedForComparison, productId]);
    }
  };

  const comparisonProducts = wishlistProducts.filter(p => selectedForComparison.includes(p.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading wishlist...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="max-w-4xl mx-auto px-4 flex-1 w-full py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              My Wishlist
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your wishlist
            </p>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90">
                Sign In
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

      <main className="max-w-7xl mx-auto px-4 flex-1 w-full py-8">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
          My Wishlist
        </h1>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg">
            <p className="text-xl text-muted-foreground mb-6">Your wishlist is empty</p>
            <Link href="/products">
              <Button className="gap-2">
                Start Shopping
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Comparison Mode Toggle */}
            <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
              <div>
                <h2 className="font-semibold text-foreground">
                  {comparisonMode ? `Compare Products (${selectedForComparison.length} selected)` : `${wishlistProducts.length} items in wishlist`}
                </h2>
              </div>
              <div className="flex gap-4">
                {comparisonMode && selectedForComparison.length > 0 && (
                  <Link href={`/compare?products=${selectedForComparison.join(',')}`}>
                    <Button className="bg-primary hover:bg-primary/90">
                      View Comparison
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => {
                    setComparisonMode(!comparisonMode);
                    setSelectedForComparison([]);
                  }}
                  variant={comparisonMode ? 'default' : 'outline'}
                >
                  {comparisonMode ? 'Done Comparing' : 'Compare'}
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(product => (
                <div
                  key={product.id}
                  className={`bg-card border-2 rounded-lg overflow-hidden transition-all ${
                    comparisonMode && selectedForComparison.includes(product.id)
                      ? 'border-primary shadow-lg'
                      : 'border-border'
                  }`}
                >
                  {/* Comparison Checkbox */}
                  {comparisonMode && (
                    <div className="p-3 bg-muted border-b border-border">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedForComparison.includes(product.id)}
                          onChange={() => toggleComparison(product.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-foreground">Add to comparison</span>
                      </label>
                    </div>
                  )}

                  {/* Product Image */}
                  <Link href={`/products/${product.id}`}>
                    <div className="relative w-full h-64 bg-muted overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 space-y-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-serif text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-serif font-bold text-primary">
                        ₹{product.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.rating} ★
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 border-t border-border">
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border border-border hover:bg-muted transition-colors text-destructive"
                      >
                        <Trash2 size={18} />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-medium"
                      >
                        <ShoppingCart size={18} />
                        <span className="text-sm">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
