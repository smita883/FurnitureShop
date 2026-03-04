import { NextRequest, NextResponse } from 'next/server';
import { db, Product } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const products = db.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const product: Product = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      category: data.category,
      materials: data.materials || [],
      colors: data.colors || [],
      sizes: data.sizes || [],
      rating: 0,
      reviewCount: 0,
      inStock: data.inStock !== false,
      createdAt: new Date().toISOString(),
    };
    
    const newProduct = db.createProduct(product);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
