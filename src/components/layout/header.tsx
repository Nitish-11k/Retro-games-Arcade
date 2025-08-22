
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { useRouter, usePathname } from 'next/navigation';
import { lazy, Suspense } from 'react';

// Lazy load auth components to improve header performance
const AuthModal = lazy(() => import('@/components/auth/auth-modal').then(mod => ({ default: mod.AuthModal })));

const Header = () => {
  const { user, loading, logout } = useAuth();
  const { scrollToSection } = useSmoothScroll();
  const router = useRouter();
  const pathname = usePathname();

  // Preload auth components when user hovers over auth area
  const preloadAuth = () => {
    // This will trigger the lazy loading in the background
    import('@/components/auth/auth-modal');
  };

  const handleNavigation = (section: string) => {
    if (pathname === '/') {
      // If we're on homepage, scroll to section
      scrollToSection(section);
    } else {
      // If we're on other pages, navigate to homepage first
      router.push('/');
      // Use a simple timeout that's reliable
      setTimeout(() => {
        // Check if we're on homepage before scrolling
        if (window.location.pathname === '/') {
          scrollToSection(section);
        }
      }, 300);
    }
  };

  const isHomePage = pathname === '/';

  const navLinks = (
    <>
      <button 
        onClick={() => handleNavigation('games')} 
        className={`hover:text-primary transition-colors font-headline text-lg cursor-pointer ${
          isHomePage ? 'text-primary' : 'text-gray-300 hover:text-primary'
        }`}
        title={isHomePage ? "Scroll to games section" : "Go to homepage games section"}
      >
        All Games
      </button>
      <button 
        onClick={() => handleNavigation('leaderboard')} 
        className={`hover:text-primary transition-colors font-headline text-lg cursor-pointer ${
          isHomePage ? 'text-primary' : 'text-gray-300 hover:text-primary'
        }`}
        title={isHomePage ? "Scroll to leaderboard section" : "Go to homepage leaderboard section"}
      >
        Leaderboard
      </button>
      <Link 
        href="/contact" 
        className={`hover:text-primary transition-colors font-headline text-lg ${
          pathname === '/contact' ? 'text-primary' : 'text-gray-300 hover:text-primary'
        }`}
      >
        Contact
      </Link>
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
              <div onMouseEnter={preloadAuth}>
                <Suspense fallback={
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-sm uppercase" disabled>Log In</Button>
                    <Button variant="secondary" className="text-sm uppercase" disabled>Sign Up</Button>
                  </div>
                }>
                  <>
                    <AuthModal mode="login">
                      <Button variant="ghost" className="text-sm uppercase">Log In</Button>
                    </AuthModal>
                    <AuthModal mode="signup">
                      <Button variant="secondary" className="text-sm uppercase">Sign Up</Button>
                    </AuthModal>
                  </>
                </Suspense>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
