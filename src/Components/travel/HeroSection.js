import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const textY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-[#1a1a2e]">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0"
      >
        <motion.img
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1920&q=80"
          alt="Travel Hero"
          className="w-full h-full object-cover"
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/60 via-transparent to-[#1a1a2e]" />
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#c17f59]/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-[#87a878]/20 blur-3xl pointer-events-none"
      />

      {/* Main Content */}
      <motion.div 
        style={{ y: textY, opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 text-[#f4e8d8]/80 mb-6"
        >
          <MapPin className="w-4 h-4" />
          <span className="text-sm tracking-[0.3em] uppercase font-light">Discover the World</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight"
        >
          <span className="block">offRoute</span>
          <motion.span 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="block text-[#c17f59] italic font-serif"
          >
            Chronicles
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-[#f4e8d8]/70 max-w-xl font-light leading-relaxed"
        >
          Journey through breathtaking destinations, immerse in cultures, 
          and discover stories that inspire your next adventure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex gap-4"
        >
          <Link to={createPageUrl('Stories')}>
            <button className="px-8 py-4 bg-[#c17f59] text-white rounded-full text-sm tracking-wider uppercase hover:bg-[#a66b48] transition-all duration-300 hover:scale-105">
              Explore Stories
            </button>
          </Link>
          <Link to={createPageUrl('Destinations')}>
            <button className="px-8 py-4 border border-white/30 text-white rounded-full text-sm tracking-wider uppercase hover:bg-white/10 transition-all duration-300">
              Destinations
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex flex-col items-center text-white/50"
        >
          <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}