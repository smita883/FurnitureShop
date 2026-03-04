'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { userStorage } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter your email');
        return;
      }

      const user = db.getUserByEmail(email);
      
      if (!user) {
        setError('No account found with this email. Please sign up first.');
        setLoading(false);
        return;
      }

      // Store user in local storage
      userStorage.set(user);
      router.push('/account');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-md mx-auto px-4 flex-1 w-full py-12 flex items-center justify-center">
        <div className="w-full bg-card border border-border rounded-lg p-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in to your account to view orders and manage preferences
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-center text-sm text-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:text-primary/80">
                Sign up here
              </Link>
            </p>
            <Link href="/" className="block text-center text-sm text-primary hover:text-primary/80">
              Continue as guest
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
