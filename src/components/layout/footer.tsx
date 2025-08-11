import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t-4 border-gray-700 mt-16 font-mono">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/about" className="text-purple-400 hover:text-purple-300 transition-colors">
            About Us
          </Link>
          <Link href="/privacy" className="text-green-400 hover:text-green-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
        <p className="text-sm">
          © 2025 Retro Arcade Zone | Powered by Pixels. Built by TeamRetro.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
