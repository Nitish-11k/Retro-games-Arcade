
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/auth-modal';
import { UserCircle, LogOut } from 'lucide-react';

const Header = () => {
  const { user, loading, logout } = useAuth();

  return (
    <header className="py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-2xl md:text-3xl font-headline tracking-tighter">
          <span className="animate-pulse">🕹️</span>
          <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            {' '}
            Retro Arcade Zone
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4 text-sm uppercase font-headline">
            <a href="#games" className="hover:text-primary transition-colors font-headline">All Games</a>
            <a href="#leaderboard" className="hover:text-primary transition-colors font-headline">Leaderboard</a>
            <a href="#recommender" className="hover:text-primary transition-colors font-headline">AI Recs</a>
          </nav>
          <div className="flex items-center gap-2">
            {!loading && user ? (
              <>
                <div className="flex items-center gap-2">
                   <UserCircle className="h-5 w-5" />
                   <span className="text-sm hidden sm:inline">{user.displayName || user.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : !loading ? (
              <>
                <AuthModal mode="login">
                  <Button variant="ghost" className="text-sm uppercase">Log In</Button>
                </AuthModal>
                <AuthModal mode="signup">
                  <Button variant="secondary" className="text-sm uppercase">Sign Up</Button>
                </AuthModal>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
