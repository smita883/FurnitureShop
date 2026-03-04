import { NextRequest, NextResponse } from 'next/server';
import { db, User } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (email) {
      const user = db.getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }
    
    const users = db.getUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const existingUser = db.getUserByEmail(data.email);
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    
    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name || '',
      phone: data.phone || '',
      address: data.address || '',
      createdAt: new Date().toISOString(),
    };
    
    const newUser = db.createUser(user);
    // Remove sensitive data before returning
    const { ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
