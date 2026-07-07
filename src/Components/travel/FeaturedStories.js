import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactionButtons from '../blog/ReactionButtons';

export default function FeaturedStories({ posts }) {
  const featured = posts?.filter(p => p.featured)?.slice(0, 3) || [];
  
  if (featured.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-8 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-[#c17f59] text-sm tracking-[0.3em] uppercase">Featured Stories</span>
          <h2 className="text-4xl md:text-5xl font-light text-[#1a1a2e] mt-4">
            Tales from the <span className="italic font-serif text-[#c17f59]">Road</span>
          </h2>
        </motion.div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Featured */}
          {featured[0] && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:row-span-2"
            >
              <Link to={`/blog/${featured[0].id}`}>
                <div className="group relative h-[300px] md:h-[500px] lg:h-full rounded-3xl overflow-hidden cursor-pointer">
                  <motion.img
                    src={featured[0].image}
                    alt={featured[0].title}
                    loading="lazy"
                    decoding="async"
                    width="1200"
                    height="800"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {featured[0].destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featured[0].read_time || 5} min read
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl text-white font-light mb-4 group-hover:text-[#c17f59] transition-colors">
                      {featured[0].title}
                    </h3>
                    <p className="text-white/70 line-clamp-2 mb-4">{featured[0].excerpt}</p>
                    <div className="mb-4">
                      <ReactionButtons 
                        entityType="blog_post" 
                        entityId={featured[0].id} 
                        variant="compact"
                      />
                    </div>
                    <motion.div 
                      className="inline-flex items-center gap-2 text-[#c17f59]"
                      whileHover={{ x: 10 }}
                    >
                      Read Story <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Secondary Featured */}
          <div className="space-y-8">
            {featured.slice(1, 3).map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/blog/${post.id}`}>
                  <div className="group relative h-[220px] md:h-[240px] rounded-3xl overflow-hidden cursor-pointer">
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      width="800"
                      height="450"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/30 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-4 text-white/70 text-xs mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {post.author}
                        </span>
                        <span className="px-2 py-1 bg-[#c17f59]/80 rounded-full text-white">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl text-white font-light group-hover:text-[#c17f59] transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}