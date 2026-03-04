import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Vishwakarma Furniture
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Bringing timeless craftsmanship and modern design together since our inception.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Vishwakarma Furniture was founded with a simple yet powerful vision: to create handcrafted wooden furniture that combines traditional woodworking techniques with contemporary design aesthetics.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Every piece in our collection is meticulously crafted by skilled artisans who have inherited their craft from generations of master craftsmen. We believe that furniture is not just functional—it's an investment in your home and lifestyle.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our commitment to quality, sustainability, and customer satisfaction sets us apart in the furniture industry.
              </p>
            </div>
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <div className="text-muted-foreground">
                <p className="text-center">Craftsmanship Gallery</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Craftsmanship</h3>
                <p className="text-sm text-muted-foreground">
                  We honor traditional woodworking techniques passed down through generations.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">♻</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  We source responsibly harvested materials and use eco-friendly finishes.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❤</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Customer Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Your satisfaction is our priority, backed by exceptional customer service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12 text-center">
            Our Team
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Our team consists of passionate craftspeople, designers, and furniture enthusiasts dedicated to delivering the finest handcrafted furniture.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Master Craftsman', 'Design Lead', 'Customer Care', 'Operations'].map(role => (
              <div key={role} className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-foreground">{role}</h3>
                <p className="text-sm text-muted-foreground mt-1">Expert Team Member</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-accent py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Explore our collection of handcrafted furniture and find the perfect pieces for your home.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Shop Collection
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
