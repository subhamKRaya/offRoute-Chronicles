import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowLeft, Calendar, Share2, Image as ImageIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { createPageUrl } from '../utils';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import CommentSection from '../Components/blog/CommentSection';
import ReactionButtons from '../Components/blog/ReactionButtons';

const categoryColors = {
  adventure: 'bg-orange-500',
  culture: 'bg-purple-500',
  food: 'bg-red-500',
  nature: 'bg-green-500',
  city: 'bg-blue-500',
  beach: 'bg-cyan-500',
  mountains: 'bg-slate-600',
};

export default function BlogPost() {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => base44.entities.BlogPost.get(id),
    enabled: !!id,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['relatedPosts', post?.category, id],
    queryFn: async () => {
      const allPosts = await base44.entities.BlogPost.list();
      return allPosts.filter(p => p.category === post.category && p.id !== id).slice(0, 3);
    },
    enabled: !!post?.category && !!id,
  });

  const { data: galleryImages = [] } = useQuery({
    queryKey: ['galleryImages', id],
    queryFn: () => base44.entities.GalleryImage.list(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#c17f59] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center">
        <h1 className="text-2xl text-[#1a1a2e] mb-4">Story not found</h1>
        <Link 
          to={createPageUrl('Stories')}
          className="text-[#c17f59] hover:underline"
        >
          Back to Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/40 to-transparent" />
        
        {/* Back Button */}
        <Link 
          to={createPageUrl('Stories')}
          className="absolute top-24 left-4 md:left-8 z-20"
        >
          <motion.div
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Stories</span>
          </motion.div>
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-4">
                {post.category && (
                  <span className={`px-4 py-1 rounded-full text-sm text-white ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                )}
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  {post.author && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {post.author}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.read_time || 5} min read
                  </span>
                  {post.created_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(post.created_date), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-white/80 text-lg max-w-2xl">
                  {post.excerpt}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Reactions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 pb-6 border-b border-[#1a1a2e]/10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className="text-[#1a1a2e]/60 text-sm block mb-3">How did this story make you feel?</span>
                <ReactionButtons entityType="blog_post" entityId={id} />
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-[#1a1a2e]/5 flex items-center justify-center hover:bg-[#c17f59] hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-slate max-w-none"
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-light text-[#1a1a2e] mt-12 mb-6">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-light text-[#1a1a2e] mt-10 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-light text-[#1a1a2e] mt-8 mb-4">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-[#1a1a2e]/80 leading-relaxed mb-6">{children}</p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#c17f59] pl-6 my-8 italic text-[#1a1a2e]/70">
                    {children}
                  </blockquote>
                ),
                img: ({ src, alt }) => (
                  <figure className="my-10">
                    <img src={src} alt={alt} className="w-full rounded-2xl" />
                    {alt && <figcaption className="text-center text-sm text-[#1a1a2e]/50 mt-3">{alt}</figcaption>}
                  </figure>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-[#c17f59] hover:underline">{children}</a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.article>

          {/* Gallery */}
          {post.gallery_images && post.gallery_images.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="w-6 h-6 text-[#c17f59]" />
                <h3 className="text-2xl font-light text-[#1a1a2e]">Photo Gallery</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.gallery_images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden group"
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Database Gallery Section */}
          {galleryImages && galleryImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="w-6 h-6 text-[#c17f59]" />
                <h3 className="text-2xl font-light text-[#1a1a2e]">Photo Gallery</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={image.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden group relative"
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop';
                      }}
                    />
                    {image.alt_text && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                        <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {image.alt_text}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Comments Section */}
          <CommentSection postId={id} />
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#faf9f7] to-[#1a1a2e]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-light text-[#1a1a2e] mb-3">
                Explore More <span className="italic font-serif text-[#c17f59]">Stories</span>
              </h2>
              <p className="text-gray-600">Discover similar stories and expand your travel inspiration</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((related, index) => (
                <motion.article
                  key={related.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${related.id}`}>
                    <div className="group cursor-pointer h-full">
                      <div className="relative h-56 rounded-2xl overflow-hidden mb-4">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-medium">View Photos & Story</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-2">
                        <span className="text-xs text-[#c17f59] font-semibold uppercase tracking-wide">
                          {related.category}
                        </span>
                        <h3 className="text-lg font-serif font-bold text-[#1a1a2e] group-hover:text-[#c17f59] transition-colors mt-2 line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {related.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}