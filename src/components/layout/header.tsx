
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/auth-modal';
import { UserCircle, LogOut, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { user, loading, logout } = useAuth();
  const isMobile = useIsMobile();

  const navLinks = (
    <>
      <a href="/#games" className="hover:text-primary transition-colors font-headline text-lg">All Games</a>
      <a href="/#leaderboard" className="hover:text-primary transition-colors font-headline text-lg">Leaderboard</a>
      <a href="/contact" className="hover:text-primary transition-colors font-headline text-lg">Contact</a>
    </>
  );

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
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900 text-white">
              <nav className="flex flex-col items-center space-y-6 text-lg uppercase font-headline mt-10">
                {navLinks}
              </nav>
              <div className="flex flex-col items-center gap-4 mt-10">
                {!loading && user ? (
                  <>
                    <div className="flex items-center gap-2">
                       <UserCircle className="h-6 w-6" />
                       <span className="text-lg">{user.displayName || user.email}</span>
                    </div>
                    <Button variant="ghost" onClick={logout} className="w-full">
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : !loading ? (
                  <>
                    <AuthModal mode="login">
                      <Button variant="ghost" className="w-full text-lg uppercase">Log In</Button>
                    </AuthModal>
                    <AuthModal mode="signup">
                      <Button variant="secondary" className="w-full text-lg uppercase">Sign Up</Button>
                    </AuthModal>
                  </>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-4 text-sm uppercase font-headline">
              {navLinks}
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
        )}
      </div>
    </header>
  );
};

export default Header;
