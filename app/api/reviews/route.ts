import { NextRequest, NextResponse } from 'next/server';
import { db, Review } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    const reviews = db.getReviews(productId || undefined);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const review: Review = {
      id: Date.now().toString(),
      productId: data.productId,
      userId: data.userId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };
    
    const newReview = db.createReview(review);
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
