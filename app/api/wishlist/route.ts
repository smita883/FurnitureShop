import { NextRequest, NextResponse } from 'next/server';
import { db, Wishlist } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    
    const wishlist = db.getWishlist(userId);
    return NextResponse.json(wishlist);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const wishlistItem: Wishlist = {
      id: Date.now().toString(),
      userId: data.userId,
      productId: data.productId,
      addedAt: new Date().toISOString(),
    };
    
    const newItem = db.addToWishlist(wishlistItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const productId = request.nextUrl.searchParams.get('productId');
    
    if (!userId || !productId) {
      return NextResponse.json({ error: 'userId and productId required' }, { status: 400 });
    }
    
    db.removeFromWishlist(userId, productId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
