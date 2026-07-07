import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';

import HeroSection from '../Components/travel/HeroSection';
import FeaturedStories from '../Components/travel/FeaturedStories';
import DestinationExplorer from '../Components/travel/DestinationExplorer';
import BlogGrid from '../Components/travel/BlogGrid';
import AboutSection from '../Components/travel/AboutSection';
import Newsletter from '../Components/travel/Newsletter';

export default function Home() {
  const { data: posts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
  });

  const { data: destinations = [] } = useQuery({
    queryKey: ['destinations'],
    queryFn: () => base44.entities.Destination.list(),
  });

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <HeroSection />
      <FeaturedStories posts={posts} />
      <AboutSection />

      <DestinationExplorer destinations={destinations} />
      <BlogGrid posts={posts} />
      <Newsletter />
    </div>
  );
}