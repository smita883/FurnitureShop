// Client-side storage utilities for cart and user session
export const cartStorage = {
  get: () => {
    if (typeof window === 'undefined') return [];
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  },
  set: (items: any[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(items));
  },
  add: (item: any) => {
    if (typeof window === 'undefined') return;
    const items = cartStorage.get();
    const existingItem = items.find((i: any) => 
      i.productId === item.productId && 
      JSON.stringify(i.customization) === JSON.stringify(item.customization)
    );
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.push(item);
    }
    cartStorage.set(items);
    return items;
  },
  remove: (productId: string, customization?: any) => {
    if (typeof window === 'undefined') return;
    const items = cartStorage.get();
    const filtered = items.filter((i: any) => {
      if (customization) {
        return !(i.productId === productId && JSON.stringify(i.customization) === JSON.stringify(customization));
      }
      return i.productId !== productId;
    });
    cartStorage.set(filtered);
    return filtered;
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cart');
  },
};

export const userStorage = {
  get: () => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  set: (user: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  },
};
