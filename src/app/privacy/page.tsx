import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - Retro Arcade Zone',
  description: 'Our privacy policy outlines how we collect, use, and protect your data at Retro Arcade Zone.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy - Retro Arcade Zone',
    description: 'Our privacy policy outlines how we collect, use, and protect your data at Retro Arcade Zone.',
    url: 'https://retroarcade.in/privacy',
  },
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="bg-gray-800 border-4 border-green-500 rounded-lg p-8 shadow-[8px_8px_0px_#22C55E]">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-6 text-center tracking-wider">
            Privacy Policy
          </h1>
          <p className="text-center text-gray-400 mb-8">Last Updated: August 11, 2025</p>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <p>
              Welcome to Retro Arcade Zone! Your privacy is important to us. This policy explains what information we collect and how we use it to provide you with a fun and competitive gaming experience.
            </p>

            <div>
              <h2 className="text-2xl font-bold text-green-300 mb-3">1. Information We Collect</h2>
              <p>
                To enhance your experience on our site, we collect the following information:
              </p>
              <ul className="list-disc list-inside mt-2 pl-4 space-y-1 text-gray-400">
                <li><span className="font-bold text-green-400">Account Information:</span> When you sign up, we collect your email address and a display name (username), which is limited to 3 characters.</li>
                <li><span className="font-bold text-green-400">Gameplay Data:</span> We store your high scores for the games you play.</li>
              </ul>
              <p className="mt-2">
                This information is collected when you create an account via email/password or through Google Sign-In.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-300 mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside mt-2 pl-4 space-y-1 text-gray-400">
                <li><span className="font-bold text-green-400">Leaderboards:</span> Your display name and high scores are shown on our public leaderboards to foster a competitive and fun environment. Your email address is never made public.</li>
                <li><span className="font-bold text-green-400">Achievements & Game Progression:</span> We track your scores to award achievements and manage your progress in games like Pixel Paddle and Pixel Slither.</li>
                <li><span className="font-bold text-green-400">Authentication:</span> Your email address is used to securely identify you, manage your account, and allow you to log in to save your progress.</li>
              </ul>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-green-300 mb-3">3. Data Storage and Security</h2>
                <p>Your data is securely stored using Google Firebase, a trusted and secure platform. We take reasonable measures to protect your information from unauthorized access or disclosure.</p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-green-300 mb-3">4. Data Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your display name and scores are publicly visible on leaderboards, but your email address remains private.</p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-green-300 mb-3">5. Third-Party Services</h2>
                <p>We use Google Firebase Authentication (including Google Sign-In) to manage user accounts. By using these services to log in, you are also subject to Google's Privacy Policy.</p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-green-300 mb-3">6. Your Data Rights</h2>
                <p>You have the right to access and manage your data. If you wish to have your account and associated data (display name and scores) deleted, please contact us at <a href="mailto:contact@retroarcade.in" className="text-green-400 hover:underline">contact@retroarcade.in</a>.</p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-green-300 mb-3">7. Children's Privacy</h2>
                <p>Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.</p>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-green-300 mb-3">8. Changes to This Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-green-300 mb-3">9. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto: retroarcade1410@gmail.com" className="text-green-400 hover:underline">retroarcade1410@gmail.com</a>.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
