import { NextRequest, NextResponse } from 'next/server';
import { db, ChatRoom } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const roomId = request.nextUrl.searchParams.get('roomId');
    
    if (roomId) {
      const messages = db.getMessages(roomId);
      return NextResponse.json(messages);
    }
    
    const rooms = db.getChatRooms(userId || undefined);
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (data.type === 'room') {
      const room: ChatRoom = {
        id: 'ROOM-' + Date.now().toString(),
        userId: data.userId,
        userName: data.userName,
        createdAt: new Date().toISOString(),
        closed: false,
      };
      
      const newRoom = db.createChatRoom(room);
      return NextResponse.json(newRoom, { status: 201 });
    } else if (data.type === 'message') {
      const message = {
        id: Date.now().toString(),
        roomId: data.roomId,
        sender: data.sender,
        message: data.message,
        timestamp: new Date().toISOString(),
      };
      
      const newMessage = db.addMessage(message);
      return NextResponse.json(newMessage, { status: 201 });
    }
    
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process chat action' }, { status: 500 });
  }
}
