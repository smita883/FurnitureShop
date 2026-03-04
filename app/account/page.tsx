'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Order } from '@/lib/db';
import { db } from '@/lib/db';
import { userStorage } from '@/lib/storage';
import { LogOut, User, Package, Settings } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = userStorage.get();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    const userOrders = db.getOrders(currentUser.id);
    setOrders(userOrders);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    userStorage.clear();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 flex-1 w-full py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
                <h2 className="font-serif text-2xl font-bold">My Account</h2>
              </div>
              
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Package size={20} />
                  <span className="font-medium">Orders ({orders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Settings size={20} />
                  <span className="font-medium">Settings</span>
                </button>
                
                <div className="pt-4 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-destructive hover:bg-destructive/10 transition-colors font-medium"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Profile Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-semibold text-foreground">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold text-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-semibold text-foreground">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                      <p className="font-semibold text-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Address</p>
                    <p className="font-semibold text-foreground">
                      {user.address || 'Not provided'}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={() => setActiveTab('settings')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{orders.length}</p>
                    <p className="text-sm text-muted-foreground mt-2">Total Orders</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6 text-center">
                    <p className="text-3xl font-bold text-accent">
                      ₹{orders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Total Spent</p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Your Orders
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-6">You haven't placed any orders yet</p>
                    <Link href="/products">
                      <Button className="bg-primary hover:bg-primary/90">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="font-semibold text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="text-sm text-muted-foreground">Items</p>
                              <p className="font-semibold text-foreground">{order.items.length}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total</p>
                              <p className="font-semibold text-foreground">
                                ₹{order.totalPrice.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'confirmed'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Account Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-3 rounded border border-border bg-muted text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={user.phone}
                      className="w-full px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue={user.address}
                      className="w-full px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="pt-6 border-t border-border">
                    <Button className="bg-primary hover:bg-primary/90">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
