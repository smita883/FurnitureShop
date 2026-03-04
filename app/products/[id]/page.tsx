'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CustomizationPanel } from '@/components/customization-panel';
import { RatingDisplay } from '@/components/rating-display';
import { ReviewsSection } from '@/components/reviews-section';
import { ProductGrid } from '@/components/product-grid';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/db';
import { db } from '@/lib/db';
import { sampleProducts } from '@/lib/seed-data';
import { cartStorage } from '@/lib/storage';
import { ChevronRight, Share2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('furniture_products');
      const allProducts = stored ? JSON.parse(stored) : sampleProducts;
      db.setProducts(allProducts);
      
      const foundProduct = allProducts.find((p: Product) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        const related = allProducts
          .filter((p: Product) => p.category === foundProduct.category && p.id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    }
    setLoading(false);
  }, [id]);

  const handleAddToCart = (customization: any) => {
    if (product) {
      const cartItem = {
        id: Date.now().toString(),
        productId: product.id,
        quantity: customization.quantity,
        customization: {
          color: customization.color,
          size: customization.size,
          material: customization.material,
        },
        price: product.price,
      };
      cartStorage.add(cartItem);
      // Optionally redirect to cart
      // router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you are looking for does not exist.
          </p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 flex-1 w-full py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8 text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <ChevronRight size={16} />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-semibold text-accent mb-2 uppercase tracking-wide">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-primary"
                >
                  <Share2 size={16} />
                  Share
                </Button>
              </div>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Customization Panel */}
            <CustomizationPanel product={product} onAddToCart={handleAddToCart} />
          </div>
        </div>

        {/* Details Tabs */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-16">
          <div className="flex gap-8 border-b border-border p-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'specifications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Specifications
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'description' ? (
              <div className="prose prose-sm max-w-none text-foreground">
                <p>{product.description}</p>
                <h3 className="font-serif text-xl font-bold mt-6 mb-3">Craftsmanship</h3>
                <p>
                  Each piece in our collection is meticulously handcrafted by skilled artisans who have honed their craft over many years. We combine traditional woodworking techniques with modern design sensibilities to create furniture that is both beautiful and functional.
                </p>
                <h3 className="font-serif text-xl font-bold mt-6 mb-3">Quality Materials</h3>
                <p>
                  We source only the finest wood and eco-friendly finishes for our furniture. Our commitment to sustainability means we use responsibly harvested materials that will last for generations.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Materials</h4>
                    <p className="text-muted-foreground">{product.materials.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Available Sizes</h4>
                    <p className="text-muted-foreground">{product.sizes.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Colors</h4>
                    <p className="text-muted-foreground">{product.colors.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Price</h4>
                    <p className="text-muted-foreground">₹{product.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-16 bg-card border border-border rounded-lg p-6 md:p-8">
          <ReviewsSection product={product} />
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
              Related Products
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
