import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../Components/ui/input';

const categories = [
  { value: 'all', label: 'All Stories' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'culture', label: 'Culture' },
  { value: 'food', label: 'Food' },
  { value: 'nature', label: 'Nature' },
  { value: 'city', label: 'City' },
  { value: 'beach', label: 'Beach' },
  { value: 'mountains', label: 'Mountains' },
];

const categoryColors = {
  adventure: 'bg-orange-500',
  culture: 'bg-purple-500',
  food: 'bg-red-500',
  nature: 'bg-green-500',
  city: 'bg-blue-500',
  beach: 'bg-cyan-500',
  mountains: 'bg-slate-600',
};

// Normalize category values and handle common aliases so filtering matches stored data
function normalizeCategory(cat) {
  if (!cat) return '';
  const s = cat.toString().toLowerCase().trim();
  const normalized = s.replace(/\s+/g, '_');
  const aliases = {
    food_cafe: 'food',
    foodcafe: 'food',
    heritage: 'culture',
    mountain: 'mountains',
    mountainss: 'mountains',
  };
  return aliases[normalized] || normalized;
}

export default function Stories() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
  });

  const filteredPosts = posts.filter(post => {
    const postCategory = normalizeCategory(post.category);
    const matchesCategory = activeCategory === 'all' || postCategory === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(q) ||
                          post.excerpt.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero Section with Background */}
      <section className="relative min-h-[24rem] md:h-80 overflow-hidden pt-20">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Stories background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          width="1920"
          height="720"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/70 via-[#1a1a2e]/60 to-[#faf9f7]" />
        
        {/* Header Content */}
        <motion.div
          initial={isSmallScreen ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={isSmallScreen ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Travel <span className="text-[#c17f59]">Stories</span>
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Discover inspiring travel stories from around the world
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 pt-8"
        >
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                id="search-stories"
                name="search"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === cat.value
                    ? 'bg-[#c17f59] text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#c17f59]'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={isSmallScreen ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={isSmallScreen ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={isSmallScreen ? { opacity: 0 } : { opacity: 0, y: -20 }}
                transition={{ delay: isSmallScreen ? 0 : index * 0.05 }}
                className="cursor-pointer"
              >
                <Link to={`/blog/${post.id}`}>
                  <motion.div 
                    className="group"
                    whileHover={!isSmallScreen ? { y: -8 } : undefined}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Image Container */}
                    <div className="relative h-64 rounded-3xl overflow-hidden mb-4">
                      <motion.img
                        src={post.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=350&fit=crop'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width="500"
                        height="350"
                        whileHover={!isSmallScreen ? { scale: 1.1 } : undefined}
                        transition={{ duration: 0.6 }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=350&fit=crop';
                        }}
                      />
                      {/* Category Badge */}
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full text-white ${categoryColors[normalizeCategory(post.category)] || 'bg-gray-500'}`}
                      >
                        {(post.category || '').toLowerCase() || 'Uncategorized'}
                      </motion.span>
                      
                      {/* Read More Icon */}
                      <motion.div
                        initial={isSmallScreen ? { opacity: 1 } : { opacity: 0, scale: 0 }}
                        whileHover={!isSmallScreen ? { opacity: 1, scale: 1 } : undefined}
                        className={`absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 ${isSmallScreen ? 'opacity-90' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <ArrowUpRight className="w-5 h-5 text-[#1a1a2e]" />
                      </motion.div>
                    </div>

                    {/* Content Container */}
                    <div className="px-2">
                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-gray-500 text-sm mb-2">
                        <span className="flex items-center gap-1">
                          📍 {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.read_time || 5} min
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-light text-[#1a1a2e] mb-2 group-hover:text-[#c17f59] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No stories found. Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
 