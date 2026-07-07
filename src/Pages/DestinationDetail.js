import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Compass, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function DestinationDetail() {
  const { id } = useParams();

  const { data: destination, isLoading } = useQuery({
    queryKey: ['destination', id],
    queryFn: () => base44.entities.Destination.get(id),
    enabled: !!id,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['postsByDestination', id],
    queryFn: () => base44.entities.BlogPost.listByDestination(id),
    enabled: !!id,
  });

  if (isLoading) return null;
  if (!destination) return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
      <div>
        <h2 className="text-2xl">Destination not found</h2>
        <Link to="/destinations" className="text-[#c17f59] hover:underline">Back to destinations</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/40 to-transparent" />

        <Link to="/destinations" className="absolute top-24 left-4 md:left-8 z-20 text-white/80 hover:text-white">
          <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Destinations</span>
          </motion.div>
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto text-white">
            <div className="flex items-center gap-4 mb-4">
              <Compass className="w-5 h-5" />
              <span className="uppercase text-sm tracking-wider text-[#c17f59]">{destination.country}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-light">{destination.name}</h1>
            {destination.description && <p className="mt-4 max-w-3xl text-white/80">{destination.description}</p>}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Destination Content */}
          {destination.content && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg prose-slate max-w-none mb-12"
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-light text-[#1a1a2e] mt-0 mb-6">{children}</h1>
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
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-6 text-[#1a1a2e]/80">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="mb-2">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#c17f59] pl-6 my-8 italic text-[#1a1a2e]/70">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {destination.content}
              </ReactMarkdown>
            </motion.article>
          )}

          {/* Highlights & Best Season */}
          {(destination.highlights || destination.best_season) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#f4e8d8] rounded-2xl p-8 mb-12"
            >
              {destination.best_season && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-[#c17f59]" />
                    <h3 className="text-lg font-semibold text-[#1a1a2e]">Best Time to Visit</h3>
                  </div>
                  <p className="text-[#1a1a2e]/80">{destination.best_season}</p>
                </div>
              )}

              {destination.highlights && destination.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Key Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {destination.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#c17f59] mt-2 flex-shrink-0"></div>
                        <span className="text-[#1a1a2e]/80">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 md:px-8 border-t border-[#1a1a2e]/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Stories & Posts about {destination.name}</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-[#1a1a2e]/60">No posts found for this destination.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(p => (
                <Link to={`/blog/${p.id}`} key={p.id} className="group">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img src={p.image} alt={p.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                    <div className="p-4 bg-white">
                      <h3 className="text-xl font-light mb-2">{p.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{p.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}