import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'About Retro Arcade Zone',
  description: 'Learn about TeamRetro and our mission to bring classic arcade games to your browser.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Retro Arcade Zone',
    description: 'Learn about TeamRetro and our mission to bring classic arcade games to your browser.',
    url: 'https://retroarcade.in/about',
  },
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="bg-gray-800 border-2 sm:border-4 border-purple-500 rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 shadow-[4px_4px_0px_#8A2BE2] sm:shadow-[8px_8px_0px_#8A2BE2]">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-purple-400 mb-3 sm:mb-4 md:mb-6 text-center tracking-wider">
            About Us
          </h1>
          <div className="space-y-3 sm:space-y-4 md:space-y-6 text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
            <p>
              Welcome to Retro Arcade Zone, your portal to the golden age of gaming! We are TeamRetro, a passionate crew dedicated to reviving the pixelated magic of classic arcade games. Our mission is simple: to deliver instant, browser-based fun without any downloads or hassle.
            </p>
            <p>
              Fueled by nostalgia and a love for simple yet challenging gameplay, we custom-code each game to capture the spirit of the 8-bit era. At Retro Arcade Zone, pixel power meets endless play. So grab your virtual joystick, aim for the high score, and step back in time with us! 🕹️
            </p>
          </div>
          <div className="mt-4 sm:mt-6 md:mt-8 text-center text-lg sm:text-xl md:text-2xl text-purple-400 animate-pulse">
            --- PRESS START ---
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
