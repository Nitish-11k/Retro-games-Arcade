import type { Metadata } from 'next';
import { Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contact Us - Retro Arcade Zone',
  description: 'Get in touch with the Retro Arcade Zone team. We\'d love to hear from you!',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us - Retro Arcade Zone',
    description: 'Get in touch with the Retro Arcade Zone team. We\'d love to hear from you!',
    url: 'https://retroarcade.in/contact',
  },
  twitter: {
    title: 'Contact Us - Retro Arcade Zone',
    description: 'Get in touch with the Retro Arcade Zone team. We\'d love to hear from you!',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-headline text-white mb-4 sm:mb-6">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions, suggestions, or just want to say hello? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-purple-400">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Email</p>
                    <a 
                      href="mailto:retroarcade1410@gmail.com" 
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base"
                    >
                      retroarcade1410@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Response Time</p>
                    <p className="text-gray-300 text-sm sm:text-base">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Location</p>
                    <p className="text-gray-300 text-sm sm:text-base">Digital Arcade - Available Worldwide</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-purple-400">What We Can Help With</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm sm:text-base">Game suggestions and feedback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm sm:text-base">Technical support and bug reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm sm:text-base">Partnership opportunities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm sm:text-base">General inquiries</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-gray-800/50 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-purple-400">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Game Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Tell us what's on your mind..."
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Direct Email Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <Card className="bg-gray-800/50 border-gray-700 text-white max-w-2xl mx-auto">
            <CardContent className="py-6 sm:py-8">
              <h3 className="text-xl sm:text-2xl font-headline text-purple-400 mb-3 sm:mb-4">
                Prefer to Email Directly?
              </h3>
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                You can also reach us directly at our Gmail address
              </p>
              <a
                href="mailto:retroarcade1410@gmail.com"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-md transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>retroarcade1410@gmail.com</span>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Sitemap Section */}
        <div className="mt-12 sm:mt-16">
          <Card className="bg-gray-800/50 border-gray-700 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl text-yellow-400">Site Navigation</CardTitle>
              <p className="text-gray-300 text-sm sm:text-base">Explore all our retro games and pages</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Games Section */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-400 text-sm sm:text-base">🎮 Retro Games</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <a href="/games/flappy-bird" className="block text-gray-300 hover:text-green-300 transition-colors">Flappy Bird</a>
                    <a href="/games/pix-man" className="block text-gray-300 hover:text-green-300 transition-colors">Pix Man</a>
                    <a href="/games/pixel-box" className="block text-gray-300 hover:text-green-300 transition-colors">Pixel Box</a>
                    <a href="/games/pixel-paddle" className="block text-gray-300 hover:text-green-300 transition-colors">Pixel Paddle</a>
                    <a href="/games/pixel-slither" className="block text-gray-300 hover:text-green-300 transition-colors">Pixel Slither</a>
                    <a href="/games/void-vanguard" className="block text-gray-300 hover:text-green-300 transition-colors">Void Vanguard</a>
                  </div>
                </div>

                {/* Pages Section */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-400 text-sm sm:text-base">📄 Pages</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <a href="/" className="block text-gray-300 hover:text-blue-300 transition-colors">Home</a>
                    <a href="/about" className="block text-gray-300 hover:text-blue-300 transition-colors">About Us</a>
                    <a href="/contact" className="block text-gray-300 hover:text-blue-300 transition-colors">Contact</a>
                    <a href="/privacy" className="block text-gray-300 hover:text-blue-300 transition-colors">Privacy Policy</a>
                  </div>
                </div>

                {/* Resources Section */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-400 text-sm sm:text-base">🔗 Resources</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <a href="/sitemap.xml" className="block text-gray-300 hover:text-purple-300 transition-colors">XML Sitemap</a>
                    <a href="/robots.txt" className="block text-gray-300 hover:text-purple-300 transition-colors">Robots.txt</a>
                    <a href="https://retroarcade.in" className="block text-gray-300 hover:text-purple-300 transition-colors">Main Site</a>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <a 
                  href="/sitemap.xml" 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-md transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                >
                  <span>📋 View Full Sitemap</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
