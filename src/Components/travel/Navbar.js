import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', page: 'Home' },
    { label: 'Stories', page: 'Stories' },
    { label: 'Destinations', page: 'Destinations' },
    { label: 'About', page: 'About' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')}>
            <motion.h1 
              className={`text-xl md:text-2xl font-light transition-colors ${
                isScrolled ? 'text-[#1a1a2e]' : 'text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              offRoute <span className="italic font-serif text-[#c17f59]">Chronicles</span>
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const linkPath = link.page === 'Home' ? '/' : `/${link.page.toLowerCase()}`;
              const isActive = location.pathname === linkPath || (linkPath !== '/' && location.pathname.startsWith(linkPath));
              return (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="relative group"
                >
                  <motion.span 
                    className={`text-sm tracking-wide transition-colors font-medium ${
                      isScrolled 
                        ? isActive ? 'text-[#c17f59]' : 'text-[#1a1a2e] group-hover:text-[#c17f59]'
                        : isActive ? 'text-[#c17f59]' : 'text-white/90 group-hover:text-white'
                    }`}
                  >
                    {link.label}
                  </motion.span>
                  <motion.span 
                    className="absolute -bottom-2 left-0 h-1 bg-[#c17f59] rounded-full"
                    animate={{ width: isActive ? '100%' : 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? 'hover:bg-[#1a1a2e]/10' : 'hover:bg-white/10'
              }`}
            >
              <Search className={`w-5 h-5 ${isScrolled ? 'text-[#1a1a2e]' : 'text-white'}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? 'hover:bg-[#1a1a2e]/10' : 'hover:bg-white/10'
              }`}
            >
              <Globe className={`w-5 h-5 ${isScrolled ? 'text-[#1a1a2e]' : 'text-white'}`} />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-[#1a1a2e]' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-[#1a1a2e]' : 'text-white'}`} />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#1a1a2e] pt-24"
          >
            <div className="flex flex-col items-center gap-8 py-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.page}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={createPageUrl(link.page)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl text-white/90 hover:text-[#c17f59] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}