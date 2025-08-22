
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut, Menu, X, Mail } from 'lucide-react';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { useRouter, usePathname } from 'next/navigation';
import { lazy, Suspense, useState, useCallback, memo } from 'react';

// Lazy load auth components to improve header performance
const AuthModal = lazy(() => import('@/components/auth/auth-modal').then(mod => ({ default: mod.AuthModal })));

const Header = memo(() => {
  const { user, loading, logout } = useAuth();
  const { scrollToSection } = useSmoothScroll();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Preload auth components when user hovers over auth area
  const preloadAuth = useCallback(() => {
    // This will trigger the lazy loading in the background
    import('@/components/auth/auth-modal');
  }, []);

  const handleNavigation = useCallback((section: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
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
  }, [pathname, router, scrollToSection]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const isHomePage = pathname === '/';
  const isContactPage = pathname === '/contact';

  const navLinks = (
    <>
      <button 
        onClick={() => handleNavigation('games')} 
        className={`hover:text-primary transition-colors font-headline text-sm md:text-base lg:text-lg cursor-pointer ${
          isHomePage ? 'text-primary' : 'text-gray-300 hover:text-primary'
        }`}
        title={isHomePage ? "Scroll to games section" : "Go to homepage games section"}
      >
        All Games
      </button>
      <button 
        onClick={() => handleNavigation('leaderboard')} 
        className={`hover:text-primary transition-colors font-headline text-sm md:text-base lg:text-lg cursor-pointer ${
          isHomePage ? 'text-primary' : 'text-gray-300 hover:text-primary'
        }`}
        title={isHomePage ? "Scroll to leaderboard section" : "Go to homepage leaderboard section"}
      >
        Leaderboard
      </button>
      <Link 
        href="/contact" 
        className={`hover:text-primary transition-colors font-headline text-sm md:text-base lg:text-lg ${
          pathname === '/contact' ? 'text-primary' : 'text-gray-300 hover:text-primary'
        }`}
        onClick={closeMobileMenu}
      >
        Contact
      </Link>
    </>
  );

  return (
    <header className="py-2 sm:py-3 md:py-4 lg:py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo - Responsive sizing for all devices */}
        <Link href="/" className="flex-shrink-0 min-w-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="animate-pulse text-base sm:text-lg md:text-xl lg:text-2xl">🕹️</span>
            <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent font-headline tracking-tighter text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-tight">
              Retro Arcade Zone
            </span>
          </div>
        </Link>
        
        {/* Desktop Navigation - Hidden on mobile/tablet, shown on large screens */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          <nav className="flex items-center space-x-4 xl:space-x-6 text-xs uppercase font-headline">
            {navLinks}
          </nav>
          <div className="flex items-center gap-2">
            {!loading && user ? (
              <>
                <div className="flex items-center gap-2">
                   <UserCircle className="h-4 w-4 xl:h-5 xl:w-5" />
                   <span className="text-xs xl:text-sm hidden xl:inline truncate max-w-32">{user.displayName || user.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 xl:h-9 xl:w-9">
                  <LogOut className="h-4 w-4 xl:h-5 xl:w-5" />
                </Button>
              </>
            ) : !loading ? (
              isContactPage ? (
                // Show "Send us Email" button on contact page
                <a
                  href="mailto:retroarcade1410@gmail.com"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 hover:from-red-600 hover:via-orange-500 hover:to-yellow-500 text-white font-semibold px-3 xl:px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105 text-xs xl:text-sm uppercase"
                >
                  <Mail className="h-3 w-3 xl:h-4 xl:w-4" />
                  <span className="hidden xl:inline">Send us Email</span>
                  <span className="xl:hidden">Email</span>
                </a>
              ) : (
                // Show login/signup buttons on other pages
                <div onMouseEnter={preloadAuth}>
                  <Suspense fallback={
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="text-xs xl:text-sm uppercase h-8 xl:h-9 px-2 xl:px-3" disabled>Log In</Button>
                      <Button variant="secondary" className="text-xs xl:text-sm uppercase h-8 xl:h-9 px-2 xl:px-3" disabled>Sign Up</Button>
                    </div>
                  }>
                    <>
                      <AuthModal mode="login">
                        <Button variant="ghost" className="text-xs xl:text-sm uppercase h-8 xl:h-9 px-2 xl:px-3">Log In</Button>
                      </AuthModal>
                      <AuthModal mode="signup">
                        <Button variant="secondary" className="text-xs xl:text-sm uppercase h-8 xl:h-9 px-2 xl:px-3">Sign Up</Button>
                      </AuthModal>
                    </>
                  </Suspense>
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* Tablet/Mobile Menu Button and User Info */}
        <div className="lg:hidden flex items-center gap-2">
          {/* User info for tablet/mobile */}
          {!loading && user ? (
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm hidden md:inline truncate max-w-24">{user.displayName || user.email}</span>
              <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 sm:h-9 sm:w-9">
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          ) : !loading && isContactPage ? (
            // Show email button on contact page for tablet/mobile
            <a
              href="mailto:retroarcade1410@gmail.com"
              className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 hover:from-red-600 hover:via-orange-500 hover:to-yellow-500 text-white font-semibold px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm uppercase"
            >
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Email</span>
            </a>
          ) : null}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="ml-1 sm:ml-2 h-8 w-8 sm:h-9 sm:w-9"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile/Tablet Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavigation('games')} 
                className="text-left hover:text-primary transition-colors font-headline text-base sm:text-lg cursor-pointer text-gray-300 hover:text-primary"
              >
                All Games
              </button>
              <button 
                onClick={() => handleNavigation('leaderboard')} 
                className="text-left hover:text-primary transition-colors font-headline text-base sm:text-lg cursor-pointer text-gray-300 hover:text-primary"
              >
                Leaderboard
              </button>
              <Link 
                href="/contact" 
                className="hover:text-primary transition-colors font-headline text-base sm:text-lg text-gray-300 hover:text-primary"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              
              {/* Mobile/Tablet Auth Buttons or Email Button */}
              {!loading && !user && (
                <div className="pt-4 border-t border-border">
                  <div className="flex flex-col space-y-3">
                    {isContactPage ? (
                      // Show "Send us Email" button on contact page
                      <a
                        href="mailto:retroarcade1410@gmail.com"
                        className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 hover:from-red-600 hover:via-orange-500 hover:to-yellow-500 text-white font-semibold px-4 py-3 rounded-md transition-all duration-200 transform hover:scale-105 text-sm uppercase w-full"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Send us Email</span>
                      </a>
                    ) : (
                      // Show login/signup buttons on other pages
                      <div onMouseEnter={preloadAuth}>
                        <Suspense fallback={
                          <div className="flex flex-col space-y-2">
                            <Button variant="ghost" className="w-full h-10 sm:h-12" disabled>Log In</Button>
                            <Button variant="secondary" className="w-full h-10 sm:h-12" disabled>Sign Up</Button>
                          </div>
                        }>
                          <>
                            <AuthModal mode="login">
                              <Button variant="ghost" className="w-full text-sm uppercase h-10 sm:h-12">Log In</Button>
                            </AuthModal>
                            <AuthModal mode="signup">
                              <Button variant="secondary" className="w-full text-sm uppercase h-10 sm:h-12">Sign Up</Button>
                            </AuthModal>
                          </>
                        </Suspense>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
