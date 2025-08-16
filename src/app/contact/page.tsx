import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Mail, Gamepad2, Zap, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - Retro Arcade Zone',
  description: 'Get in touch with TeamRetro for feedback, suggestions, or just to say hello!',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us - Retro Arcade Zone',
    description: 'Get in touch with TeamRetro for feedback, suggestions, or just to say hello!',
    url: 'https://retroarcade.in/contact',
  },
  twitter: {
    title: 'Contact Us - Retro Arcade Zone',
    description: 'Get in touch with TeamRetro for feedback, suggestions, or just to say hello!',
  },
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Contact Card */}
          <div className="bg-gray-800 border-4 border-purple-500 rounded-lg p-8 shadow-[8px_8px_0px_#8A2BE2] mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-6 text-center tracking-wider">
              CONTACT US
            </h1>
            
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-purple-600/20 rounded-full mb-4">
                <Mail className="w-16 h-16 text-purple-400" />
              </div>
              <p className="text-xl text-gray-300 mb-4">
                Ready to level up your retro gaming experience?
              </p>
              <p className="text-lg text-gray-400">
                We'd love to hear from you! Whether you have feedback, suggestions, or just want to share your high scores.
              </p>
            </div>

            {/* Email Contact Section */}
            <div className="bg-gray-700 border-2 border-yellow-500 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold text-yellow-400">GET IN TOUCH</h2>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-gray-300 mb-4">Send us an email at:</p>
                <a 
                  href="mailto:retroarcade1410@gmail.com"
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl px-8 py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  retroarcade1410@gmail.com
                </a>
              </div>
            </div>

            {/* Response Time Info */}
            <div className="bg-gray-700 border-2 border-green-500 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-xl font-bold text-green-400">RESPONSE TIME</h3>
              </div>
              <p className="text-center text-gray-300">
                We typically respond within 24 hours during weekdays. 
                <br />
                <span className="text-green-400 font-semibold">No automated responses - just real people who love retro games!</span>
              </p>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feedback Card */}
            <div className="bg-gray-800 border-2 border-blue-500 rounded-lg p-6 text-center">
              <Gamepad2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-blue-400 mb-2">GAME FEEDBACK</h3>
              <p className="text-gray-400 text-sm">
                Found a bug? Want a new feature? Let us know what you think!
              </p>
            </div>

            {/* Suggestions Card */}
            <div className="bg-gray-800 border-2 border-pink-500 rounded-lg p-6 text-center">
              <Star className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-pink-400 mb-2">GAME SUGGESTIONS</h3>
              <p className="text-gray-400 text-sm">
                Have an idea for a new retro game? We're always looking for inspiration!
              </p>
            </div>

            {/* High Scores Card */}
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-yellow-400 mb-2">HIGH SCORES</h3>
              <p className="text-gray-400 text-sm">
                Beat our records? Share your achievements and get featured!
              </p>
            </div>
          </div>

          {/* Retro Style Footer */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-gray-800 border-2 border-purple-500 rounded-lg px-6 py-3">
              <p className="text-purple-400 font-bold text-lg animate-pulse">
                --- PRESS START TO CONTACT ---
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
