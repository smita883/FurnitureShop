'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Product, Order } from '@/lib/db';
import { db } from '@/lib/db';
import { PackageOpen, ShoppingCart, TrendingUp, Users, Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Dining',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    materials: ['Sheesham'],
    colors: ['Natural Brown'],
    sizes: ['Standard'],
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allProducts = db.getProducts();
    const allOrders = db.getOrders();
    setProducts(allProducts);
    setOrders(allOrders);
    setLoading(false);
  }, []);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || newProduct.price === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      image: newProduct.image,
      category: newProduct.category,
      materials: newProduct.materials,
      colors: newProduct.colors,
      sizes: newProduct.sizes,
      rating: 0,
      reviewCount: 0,
      inStock: true,
      createdAt: new Date().toISOString(),
    };

    db.createProduct(product);
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      category: 'Dining',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
      materials: ['Sheesham'],
      colors: ['Natural Brown'],
      sizes: ['Standard'],
    });
    setShowProductForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      db.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleToggleProductStock = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      db.updateProduct(id, { inStock: !product.inStock });
      setProducts(products.map(p => 
        p.id === id ? { ...p, inStock: !p.inStock } : p
      ));
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
    averageOrderValue: orders.length > 0 ? Math.round(orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length) : 0,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 flex-1 w-full py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: PackageOpen },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'users', label: 'Users', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
                  </div>
                  <PackageOpen size={32} className="text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart size={32} className="text-accent opacity-50" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground">
                      ₹{(stats.totalRevenue / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <TrendingUp size={32} className="text-secondary opacity-50" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
                    <p className="text-3xl font-bold text-foreground">
                      ₹{stats.averageOrderValue.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp size={32} className="text-primary opacity-50" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Recent Orders
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-semibold py-3 px-4 text-foreground">Order ID</th>
                      <th className="text-left font-semibold py-3 px-4 text-foreground">Items</th>
                      <th className="text-left font-semibold py-3 px-4 text-foreground">Total</th>
                      <th className="text-left font-semibold py-3 px-4 text-foreground">Status</th>
                      <th className="text-left font-semibold py-3 px-4 text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(-5).reverse().map(order => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">{order.items.length}</td>
                        <td className="py-3 px-4">₹{order.totalPrice.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Product Management
              </h2>
              <Button
                onClick={() => setShowProductForm(!showProductForm)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus size={18} />
                Add Product
              </Button>
            </div>

            {/* Add Product Form */}
            {showProductForm && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-lg text-foreground mb-4">Add New Product</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="px-4 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="px-4 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="px-4 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Dining</option>
                    <option>Bedroom</option>
                    <option>Office</option>
                    <option>Living Room</option>
                    <option>Storage</option>
                    <option>Decor</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                    className="px-4 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="col-span-2 px-4 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                  <div className="col-span-2 flex gap-4">
                    <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90">
                      Add Product
                    </Button>
                    <Button
                      onClick={() => setShowProductForm(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Product</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Category</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Price</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Stock</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Rating</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{product.category}</td>
                      <td className="py-4 px-6 font-medium text-foreground">₹{product.price.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleProductStock(product.id)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            product.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-sm text-foreground">{product.rating} ★</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-muted rounded transition-colors">
                            <Edit2 size={16} className="text-primary" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Order Management
            </h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Order ID</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Items</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Total</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Status</th>
                    <th className="text-left font-semibold py-4 px-6 text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-6 font-medium">{order.id}</td>
                      <td className="py-4 px-6">{order.items.length}</td>
                      <td className="py-4 px-6 font-medium">₹{order.totalPrice.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              User Management
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground">
                Total users: <span className="font-bold text-foreground">{db.getUsers().length}</span>
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="text-left font-semibold py-4 px-6 text-foreground">Name</th>
                      <th className="text-left font-semibold py-4 px-6 text-foreground">Email</th>
                      <th className="text-left font-semibold py-4 px-6 text-foreground">Phone</th>
                      <th className="text-left font-semibold py-4 px-6 text-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.getUsers().map(user => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-4 px-6 font-medium">{user.name}</td>
                        <td className="py-4 px-6">{user.email}</td>
                        <td className="py-4 px-6 text-muted-foreground">{user.phone || '—'}</td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
