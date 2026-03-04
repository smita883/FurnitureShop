'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Product, CartItem as CartItemType } from '@/lib/db';
import { cartStorage, userStorage } from '@/lib/storage';
import { db } from '@/lib/db';
import { ChevronLeft, CreditCard, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const allProducts = db.getProducts();
    setProducts(allProducts);
    const cart = cartStorage.get();
    const currentUser = userStorage.get();
    setCartItems(cart);
    setUser(currentUser);
    
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.name?.split(' ')[0] || '',
        lastName: currentUser.name?.split(' ').slice(1).join(' ') || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
      }));
    }
    
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.email || !formData.address || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const subtotal = cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const newOrder = {
      id: 'ORD-' + Date.now().toString(),
      userId: user?.id || 'guest',
      items: cartItems,
      totalPrice: subtotal,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        const order = await response.json();
        setOrderId(order.id);
        setOrderPlaced(true);
        cartStorage.clear();

        // Save/update user
        if (!user && formData.email) {
          const newUser = {
            id: Date.now().toString(),
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: formData.address,
            createdAt: new Date().toISOString(),
          };
          userStorage.set(newUser);
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="max-w-3xl mx-auto px-4 flex-1 w-full py-16">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase. Your order ID is <span className="font-semibold text-foreground">{orderId}</span>
            </p>
            <div className="space-y-4 mb-8">
              <p className="text-foreground">
                We will send you a confirmation email shortly with shipping details.
              </p>
              <p className="text-sm text-muted-foreground">
                Estimated delivery: 7-10 business days
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="outline">
                  View Order Details
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = subtotal > 10000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 flex-1 w-full py-8">
        <Link href="/cart" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ChevronLeft size={20} />
          Back to Cart
        </Link>

        <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step Indicator */}
            <div className="flex gap-4">
              <div className={`flex-1 flex items-center justify-center py-3 rounded-lg border-2 cursor-pointer transition-all ${
                step === 'shipping' ? 'border-primary bg-primary/10' : 'border-border'
              }`}>
                <Truck size={20} className={step === 'shipping' ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <div className={`flex-1 flex items-center justify-center py-3 rounded-lg border-2 cursor-pointer transition-all ${
                step === 'payment' ? 'border-primary bg-primary/10' : 'border-border'
              }`}>
                <CreditCard size={20} className={step === 'payment' ? 'text-primary' : 'text-muted-foreground'} />
              </div>
            </div>

            {/* Shipping Form */}
            {step === 'shipping' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>India</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('payment')}
                  className="w-full bg-primary hover:bg-primary/90 py-3"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4 mb-8">
                  <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'razorpay' ? 'border-primary bg-primary/10' : 'border-border'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod')}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-foreground">Razorpay Payment</p>
                      <p className="text-sm text-muted-foreground">Pay securely online with Razorpay</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-primary bg-primary/10' : 'border-border'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod')}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-foreground">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep('shipping')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-primary hover:bg-primary/90 py-3"
                  >
                    Place Order (₹{total.toLocaleString()})
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 border-b border-border pb-4 max-h-64 overflow-y-auto">
                {cartItems.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  return product ? (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{product.name}</span>
                      <span className="font-medium text-foreground">
                        {item.quantity} × ₹{product.price.toLocaleString()}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="space-y-3 border-b border-border pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'text-foreground'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span className="text-foreground">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-serif font-bold text-xl text-primary">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
