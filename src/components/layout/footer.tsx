import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t-4 border-gray-700 mt-8 sm:mt-12 lg:mt-16 font-mono">
      <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 mb-4">
          <Link href="/about" className="text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base">
            About Us
          </Link>
          <Link href="/privacy" className="text-green-400 hover:text-green-300 transition-colors text-sm sm:text-base">
            Privacy Policy
          </Link>
        </div>
        <p className="text-xs sm:text-sm">
          © 2025 Retro Arcade Zone | Powered by Pixels. Built by TeamRetro.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
