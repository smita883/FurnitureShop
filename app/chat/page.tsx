'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ChatMessage, ChatRoom } from '@/lib/db';
import { db } from '@/lib/db';
import { userStorage } from '@/lib/storage';
import { Send, Plus, X } from 'lucide-react';

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = userStorage.get();
    setUser(currentUser);
    
    if (currentUser) {
      const userRooms = db.getChatRooms(currentUser.id);
      setRooms(userRooms);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      const roomMessages = db.getMessages(selectedRoom.id);
      setMessages(roomMessages);
    }
  }, [selectedRoom]);

  const handleStartChat = () => {
    if (!user) {
      return;
    }

    const room: ChatRoom = {
      id: 'ROOM-' + Date.now().toString(),
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
      closed: false,
    };

    db.createChatRoom(room);
    setRooms([...rooms, room]);
    setSelectedRoom(room);
    setShowNewChat(false);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedRoom) {
      return;
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      roomId: selectedRoom.id,
      sender: 'user',
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    db.addMessage(message);
    setMessages([...messages, message]);
    setMessageText('');

    // Simulate admin response after a delay
    setTimeout(() => {
      const adminMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        roomId: selectedRoom.id,
        sender: 'admin',
        message: 'Thank you for contacting Vishwakarma Furniture! A support team member will assist you shortly.',
        timestamp: new Date().toISOString(),
      };
      db.addMessage(adminMessage);
      setMessages(prev => [...prev, adminMessage]);
    }, 1000);
  };

  const handleCloseChat = (roomId: string) => {
    const updatedRooms = rooms.filter(r => r.id !== roomId);
    setRooms(updatedRooms);
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
    }
    // In a real app, this would update the database
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="max-w-4xl mx-auto px-4 flex-1 w-full py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Live Chat Support
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to access our live chat support
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 flex-1 w-full py-8">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
          Live Chat Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="bg-card border border-border rounded-lg flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Conversations</h2>
              {!showNewChat && (
                <button
                  onClick={() => setShowNewChat(true)}
                  className="p-2 hover:bg-muted rounded transition-colors"
                  title="Start new chat"
                >
                  <Plus size={20} className="text-primary" />
                </button>
              )}
            </div>

            {showNewChat && (
              <div className="p-4 border-b border-border space-y-3">
                <Button
                  onClick={handleStartChat}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start New Chat
                </Button>
                <Button
                  onClick={() => setShowNewChat(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {rooms.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  <p>No conversations yet</p>
                  <p className="mt-2">Click + to start a new chat</p>
                </div>
              ) : (
                rooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full px-4 py-3 border-b border-border text-left hover:bg-muted transition-colors ${
                      selectedRoom?.id === room.id ? 'bg-muted' : ''
                    }`}
                  >
                    <p className="font-medium text-foreground text-sm">{room.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(room.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg flex flex-col">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Chat Support</h3>
                    <p className="text-xs text-muted-foreground">{selectedRoom.id}</p>
                  </div>
                  <button
                    onClick={() => handleCloseChat(selectedRoom.id)}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      <p>Start typing your message to begin the conversation</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-muted text-foreground rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select a conversation or start a new chat</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
