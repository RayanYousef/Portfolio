
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-void border-t border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-orbitron font-bold text-lg text-white">
              DEV<span className="text-neon-pink">.PORTFOLIO</span>
            </span>
            <p className="text-gray-400 text-sm mt-1">Leveling up the web, one pixel at a time.</p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-neon-pink transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Game Dev Portfolio. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
