import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Compass, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactionButtons from '../Components/blog/ReactionButtons';

export default function Destinations() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: () => base44.entities.Destination.list(),
  });

  const categories = ['all', 'city', 'local', 'adventure', 'food_cafe', 'heritage'];
  const categoryLabels = {
    city: 'City',
    local: 'Local',
    adventure: 'Adventure',
    food_cafe: 'Food & Cafe',
    heritage: 'Heritage',
  };
  
  const filteredDestinations = activeCategory === 'all' ? destinations : destinations.filter(d => d.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Destinations Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/80 via-[#1a1a2e]/50 to-[#1a1a2e]" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[#c17f59] mb-4"
          >
            <Compass className="w-5 h-5" />
            <span className="text-sm tracking-[0.3em] uppercase">Explore the World</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-light text-white mb-6"
          >
            Dream <span className="italic font-serif text-[#c17f59]">Destinations</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-xl text-lg"
          >
            Discover breathtaking places that will ignite your wanderlust
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-white text-[#1a1a2e]'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {cat === 'all' ? 'All Categories' : categoryLabels[cat] || cat}
              </button>
            ))}
          </motion.div>

          {/* Destinations Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-96 bg-white/5 rounded-3xl animate-pulse" />
                ))
              ) : filteredDestinations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-16"
                >
                  <MapPin className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl text-white/60">No destinations found</h3>
                </motion.div>
              ) : (
                filteredDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredId(destination.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group relative"
                  >
                    <Link to={`/destinations/${destination.id}`} className="block">
                      <div className="relative h-96 rounded-3xl overflow-hidden cursor-pointer">
                        <motion.img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                          animate={{ 
                            scale: hoveredId === destination.id ? 1.1 : 1 
                          }}
                          transition={{ duration: 0.7 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/30 to-transparent" />

                        {/* Category Badge */}
                        {destination.category && (
                          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs bg-white/10 text-white/80">
                            {categoryLabels[destination.category] || destination.category}
                          </span>
                        )}
                        
                        {/* Content */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <motion.span 
                            className="text-[#c17f59] text-xs tracking-wider uppercase mb-2"
                            animate={{ y: hoveredId === destination.id ? -10 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {destination.country}
                          </motion.span>
                        
                        <motion.h3 
                          className="text-3xl text-white font-light mb-2"
                          animate={{ y: hoveredId === destination.id ? -10 : 0 }}
                          transition={{ duration: 0.3, delay: 0.05 }}
                        >
                          {destination.name}
                        </motion.h3>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: hoveredId === destination.id ? 1 : 0,
                            y: hoveredId === destination.id ? 0 : 20
                          }}
                          transition={{ duration: 0.3 }}
                          className="text-white/70 text-sm mb-4 line-clamp-2"
                        >
                          {destination.description}
                        </motion.p>

                        {destination.best_season && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: hoveredId === destination.id ? 1 : 0 
                            }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex items-center gap-2 text-[#c17f59] text-sm mb-4"
                          >
                            <Sun className="w-4 h-4" />
                            <span>Best time: {destination.best_season}</span>
                          </motion.div>
                        )}

                        {destination.highlights && destination.highlights.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: hoveredId === destination.id ? 1 : 0 
                            }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            className="flex flex-wrap gap-2 mb-4"
                          >
                            {destination.highlights.slice(0, 3).map((highlight, i) => (
                              <span 
                                key={i}
                                className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                              >
                                {highlight}
                              </span>
                            ))}
                          </motion.div>
                        )}
                        
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: hoveredId === destination.id ? 1 : 0
                          }}
                          transition={{ duration: 0.3, delay: 0.18 }}
                          className="mb-3"
                        >
                          <ReactionButtons 
                            entityType="destination" 
                            entityId={destination.id} 
                            variant="compact"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: hoveredId === destination.id ? 1 : 0,
                            x: hoveredId === destination.id ? 0 : -20
                          }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="flex items-center gap-2 text-[#c17f59]"
                        >
                          <span className="text-sm">Explore</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>

                      {/* Border Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl border-2 border-[#c17f59] pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredId === destination.id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}