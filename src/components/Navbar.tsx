
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Gamepad2, Github, Linkedin } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Resume', path: '/resume' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-void/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-neon-cyan" />
              <span className="font-orbitron font-bold text-xl tracking-wider text-white">
                DEV<span className="text-neon-pink">.PORTFOLIO</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${location.pathname === link.path
                    ? 'text-neon-cyan'
                    : 'text-gray-300 hover:text-white hover:text-shadow-neon'
                    }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-neon-cyan"
                    />
                  )}
                </Link>
              ))}

              <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-4">
                <a href="https://github.com/RayanYousef" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/in/rayan-yousef" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-void/95 backdrop-blur-xl border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path
                  ? 'text-neon-cyan bg-white/5'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-4 px-3 py-2">
              <a href="https://github.com/RayanYousef" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/in/rayan-yousef" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
