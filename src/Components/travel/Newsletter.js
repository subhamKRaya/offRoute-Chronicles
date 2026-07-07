import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Check } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import { Input } from '../ui/input';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    await base44.entities.Subscriber.create({ email });
    setIsSuccess(true);
    setEmail('');
    setIsSubmitting(false);
    
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-br from-[#c17f59] via-[#a66b48] to-[#8b5a3c] relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-10 right-10 w-64 h-64 border border-white/10 rounded-full"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-10 left-10 w-48 h-48 border border-white/10 rounded-full"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/30 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/40 rounded-full"
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-white/80 mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm tracking-[0.3em] uppercase">Join the Journey</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Get Wanderlust <span className="italic font-serif">Delivered</span>
          </h2>
          
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Subscribe to receive the latest travel stories, destination guides, and exclusive tips directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <div className="relative flex items-center">
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-6 pr-14 py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-1.5 w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#c17f59] hover:bg-[#f4e8d8] transition-colors disabled:opacity-70 flex-shrink-0"
              >
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </motion.div>
                ) : isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
            
            {isSuccess && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white mt-4 text-sm"
              >
                ✨ Welcome aboard! Check your inbox for a welcome message.
              </motion.p>
            )}
          </form>

          <p className="text-white/50 text-xs mt-6">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}