import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Mail, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', page: 'Home' },
    { label: 'Stories', page: 'Stories' },
    { label: 'Destinations', page: 'Destinations' },
    { label: 'About', page: 'About' },
  ];

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h3 className="text-2xl font-light mb-4">
              offRoute <span className="italic font-serif text-[#c17f59]">Chronicles</span>
            </h3>
            <p className="text-white/60 leading-relaxed mb-6 max-w-md">
              Inspiring wanderers to explore the world through captivating stories, 
              stunning photography, and authentic travel experiences.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c17f59] transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-sm tracking-widest uppercase text-white/50 mb-6">Explore</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={createPageUrl(link.page)}
                    className="text-white/70 hover:text-[#c17f59] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-sm tracking-widest uppercase text-white/50 mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-4 h-4 text-[#c17f59]" />
                contacttosubham@gmail.com
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <MapPin className="w-4 h-4 text-[#c17f59]" />
                Currently in Kathmandu, Nepal
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} offRoute Chronicles. All rights reserved.
          </p>
          <p className="text-white/40 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#c17f59]" /> for travelers
          </p>
        </motion.div>
      </div>
    </footer>
  );
}