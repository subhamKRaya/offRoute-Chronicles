import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Camera, Heart, Globe } from 'lucide-react';

const CountUp = ({ end, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default function AboutSection() {
  const stats = [
    { icon: Globe, value: 15, suffix: '+', label: 'Ciities Visited' },
    { icon: Camera, value: 20, suffix: '+', label: 'Stories Shared' },
    { icon: Heart, value: 100, suffix: '+', label: 'People Encountered' },
    { icon: MapPin, value: 50, suffix: '+', label: 'Destinations' },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-[#f4e8d8] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a1a2e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden"
              >
                <img
                  src="https://res.cloudinary.com/ddmleagbc/image/upload/v1769514554/20251129_141109_pjei4x.jpg"
                  alt="Traveler"
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="800"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
                  }}
                />
              </motion.div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-12 -right-4 md:-bottom-8 md:-right-8 bg-white rounded-2xl p-4 md:p-6 shadow-xl max-w-xs"
              >
                <p className="text-[#1a1a2e]/80 text-sm italic">
                  "Travel is the only thing you buy that makes you richer."
                </p>
                <p className="text-[#c17f59] text-xs mt-2 font-medium">— Anonymous</p>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-3 -left-3 w-16 md:w-24 h-16 md:h-24 border-2 border-[#c17f59]/30 rounded-full"
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#c17f59] text-sm tracking-[0.3em] uppercase">About the Journey</span>
            <h2 className="text-4xl md:text-5xl font-light text-[#1a1a2e] mt-4 mb-6">
              Capturing <span className="italic font-serif text-[#c17f59]">Moments</span>,<br />
              Sharing Stories
            </h2>
            
            <p className="text-[#1a1a2e]/70 text-lg leading-relaxed mb-6">
              Welcome to offRoute Chronicles, where every destination has a story waiting to be told. 
              I'm a occasional traveler dedicated to uncovering hidden gems and sharing authentic experiences 
              in simplest way.
            </p>
            
            <p className="text-[#1a1a2e]/70 leading-relaxed mb-10">
              From the bustling streets of Kathmandu to the serene lakes of Pokhara, 
              join me as I explore diverse cultures, savor local cuisines, and discover 
              the beauty that our surrounding has to offer.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#c17f59]/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-[#c17f59]" />
                  </div>
                  <div>
                    <p className="text-2xl font-light text-[#1a1a2e]">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-[#1a1a2e]/60">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}