// Data types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  materials: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  customization: {
    color?: string;
    size?: string;
    material?: string;
  };
  price: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

// In-memory database singleton for client-side operations
class InMemoryDB {
  private static instance: InMemoryDB;
  private products: Map<string, Product> = new Map();
  private reviews: Map<string, Review> = new Map();
  private users: Map<string, User> = new Map();
  private orders: Map<string, Order> = new Map();
  private wishlists: Map<string, WishlistItem> = new Map();
  private chats: Map<string, ChatMessage> = new Map();

  private constructor() {}

  static getInstance(): InMemoryDB {
    if (!InMemoryDB.instance) {
      InMemoryDB.instance = new InMemoryDB();
    }
    return InMemoryDB.instance;
  }

  // Products
  setProducts(products: Product[]) {
    this.products.clear();
    products.forEach(p => this.products.set(p.id, p));
  }

  getProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  createProduct(product: Product): Product {
    this.products.set(product.id, product);
    return product;
  }

  updateProduct(id: string, product: Partial<Product>): Product | undefined {
    const existing = this.products.get(id);
    if (existing) {
      const updated = { ...existing, ...product };
      this.products.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Reviews
  setReviews(reviews: Review[]) {
    this.reviews.clear();
    reviews.forEach(r => this.reviews.set(r.id, r));
  }

  getReviews(): Review[] {
    return Array.from(this.reviews.values());
  }

  getReviewsByProduct(productId: string): Review[] {
    return Array.from(this.reviews.values()).filter(r => r.productId === productId);
  }

  createReview(review: Review): Review {
    this.reviews.set(review.id, review);
    return review;
  }

  // Users
  setUsers(users: User[]) {
    this.users.clear();
    users.forEach(u => this.users.set(u.id, u));
  }

  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  updateUser(id: string, user: Partial<User>): User | undefined {
    const existing = this.users.get(id);
    if (existing) {
      const updated = { ...existing, ...user };
      this.users.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Orders
  setOrders(orders: Order[]) {
    this.orders.clear();
    orders.forEach(o => this.orders.set(o.id, o));
  }

  getOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  getOrdersByUser(userId: string): Order[] {
    return Array.from(this.orders.values()).filter(o => o.userId === userId);
  }

  createOrder(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  updateOrder(id: string, order: Partial<Order>): Order | undefined {
    const existing = this.orders.get(id);
    if (existing) {
      const updated = { ...existing, ...order };
      this.orders.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Wishlists
  setWishlists(items: WishlistItem[]) {
    this.wishlists.clear();
    items.forEach(w => this.wishlists.set(w.id, w));
  }

  getWishlists(): WishlistItem[] {
    return Array.from(this.wishlists.values());
  }

  getWishlistByUser(userId: string): WishlistItem[] {
    return Array.from(this.wishlists.values()).filter(w => w.userId === userId);
  }

  createWishlist(item: WishlistItem): WishlistItem {
    this.wishlists.set(item.id, item);
    return item;
  }

  deleteWishlist(id: string): boolean {
    return this.wishlists.delete(id);
  }

  // Chats
  setChats(messages: ChatMessage[]) {
    this.chats.clear();
    messages.forEach(c => this.chats.set(c.id, c));
  }

  getChats(): ChatMessage[] {
    return Array.from(this.chats.values());
  }

  getChatsByConversation(conversationId: string): ChatMessage[] {
    return Array.from(this.chats.values())
      .filter(c => c.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  createChat(message: ChatMessage): ChatMessage {
    this.chats.set(message.id, message);
    return message;
  }
}

export const db = InMemoryDB.getInstance();
