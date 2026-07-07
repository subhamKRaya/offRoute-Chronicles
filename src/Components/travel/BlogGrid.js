import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const categoryColors = {
  adventure: 'bg-orange-500',
  culture: 'bg-purple-500',
  food: 'bg-red-500',
  nature: 'bg-green-500',
  city: 'bg-blue-500',
  beach: 'bg-cyan-500',
  mountains: 'bg-slate-600',
};

export default function BlogGrid({ posts }) {
  const nonFeatured = posts?.filter(p => p.featured !== true) || [];

  if (nonFeatured.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-8 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4"
        >
          <div>
            <span className="text-[#c17f59] text-sm tracking-[0.3em] uppercase">Latest Adventures</span>
            <h2 className="text-4xl md:text-5xl font-light text-[#1a1a2e] mt-4">
              Recent <span className="italic font-serif text-[#c17f59]">Stories</span>
            </h2>
          </div>
          <Link 
            to={createPageUrl('Stories')}
            className="group flex items-center gap-2 text-[#1a1a2e] hover:text-[#c17f59] transition-colors"
          >
            <span>View All Stories</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nonFeatured.slice(0, 6).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link to={`/blog/${post.id}`}>
                <div className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-5">
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=350&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    {post.category && (
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs text-white ${categoryColors[post.category] || 'bg-slate-500'}`}>
                        {post.category}
                      </span>
                    )}

                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ArrowUpRight className="w-5 h-5 text-[#1a1a2e]" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-[#1a1a2e]/60">
                      {post.destination && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {post.destination}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.read_time || 5} min
                      </span>
                    </div>

                    <h3 className="text-xl font-light text-[#1a1a2e] group-hover:text-[#c17f59] transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-[#1a1a2e]/60 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}