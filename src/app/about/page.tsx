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
      <main className="container mx-auto px-4 py-12">
        <div className="bg-gray-800 border-4 border-purple-500 rounded-lg p-8 shadow-[8px_8px_0px_#8A2BE2]">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-6 text-center tracking-wider">
            About Us
          </h1>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              Welcome to Retro Arcade Zone, your portal to the golden age of gaming! We are TeamRetro, a passionate crew dedicated to reviving the pixelated magic of classic arcade games. Our mission is simple: to deliver instant, browser-based fun without any downloads or hassle.
            </p>
            <p>
              Fueled by nostalgia and a love for simple yet challenging gameplay, we custom-code each game to capture the spirit of the 8-bit era. At Retro Arcade Zone, pixel power meets endless play. So grab your virtual joystick, aim for the high score, and step back in time with us! 🕹️
            </p>
          </div>
          <div className="mt-8 text-center text-2xl text-purple-400 animate-pulse">
            --- PRESS START ---
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
