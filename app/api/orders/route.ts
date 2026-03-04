import { NextRequest, NextResponse } from 'next/server';
import { db, Order } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const orders = db.getOrders(userId || undefined);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const order: Order = {
      id: 'ORD-' + Date.now().toString(),
      userId: data.userId,
      items: data.items,
      totalPrice: data.totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const newOrder = db.createOrder(order);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
