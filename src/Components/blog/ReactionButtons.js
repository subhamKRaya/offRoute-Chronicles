import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../../api/base44Client';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Eye, Flame } from 'lucide-react';

const reactionIcons = {
  like: { icon: Heart, label: 'Like', color: 'text-red-500' },
  love: { icon: Flame, label: 'Love', color: 'text-orange-500' },
  wow: { icon: Eye, label: 'Wow', color: 'text-blue-500' },
  inspire: { icon: Sparkles, label: 'Inspire', color: 'text-yellow-500' },
};

export default function ReactionButtons({ entityType, entityId, variant = 'default' }) {
  const [userEmail, setUserEmail] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get user email from localStorage or generate a unique identifier
    let email = localStorage.getItem('user_reaction_id');
    if (!email) {
      email = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_reaction_id', email);
    }
    setUserEmail(email);
  }, []);

  const { data: reactions = [] } = useQuery({
    queryKey: ['reactions', entityType, entityId],
    queryFn: () => base44.entities.Reaction.filter({ entity_type: entityType, entity_id: entityId }),
    enabled: !!entityId,
  });

  const { data: userReaction } = useQuery({
    queryKey: ['userReaction', entityType, entityId, userEmail],
    queryFn: () => base44.entities.Reaction.filter({ 
      entity_type: entityType, 
      entity_id: entityId,
      user_identifier: userEmail 
    }),
    enabled: !!entityId && !!userEmail,
    select: (data) => data[0],
  });

  const createReactionMutation = useMutation({
    mutationFn: (reactionData) => base44.entities.Reaction.create(reactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions', entityType, entityId] });
      queryClient.invalidateQueries({ queryKey: ['userReaction', entityType, entityId, userEmail] });
    },
  });

  const deleteReactionMutation = useMutation({
    mutationFn: (reactionId) => base44.entities.Reaction.delete(reactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions', entityType, entityId] });
      queryClient.invalidateQueries({ queryKey: ['userReaction', entityType, entityId, userEmail] });
    },
  });

  const handleReaction = (reactionType) => {
    if (!userEmail) return;

    if (userReaction) {
      if (userReaction.reaction_type === reactionType) {
        // Remove reaction if clicking the same one
        deleteReactionMutation.mutate(userReaction.id);
      } else {
        // Update reaction by deleting old and creating new
        deleteReactionMutation.mutate(userReaction.id);
        setTimeout(() => {
          createReactionMutation.mutate({
            entity_type: entityType,
            entity_id: entityId,
            reaction_type: reactionType,
            user_identifier: userEmail,
          });
        }, 100);
      }
    } else {
      createReactionMutation.mutate({
        entity_type: entityType,
        entity_id: entityId,
        reaction_type: reactionType,
        user_identifier: userEmail,
      });
    }
  };

  const getReactionCount = (type) => 
    reactions.filter(r => r.reaction_type === type).length;

  if (variant === 'compact') {
    const totalReactions = reactions.length;
    const hasReacted = !!userReaction;

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleReaction('like')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          hasReacted 
            ? 'bg-red-500/10 text-red-500' 
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        }`}
      >
        <Heart className={`w-4 h-4 ${hasReacted ? 'fill-current' : ''}`} />
        <span className="text-sm">{totalReactions}</span>
      </motion.button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {Object.entries(reactionIcons).map(([type, { icon: Icon, label, color }]) => {
        const count = getReactionCount(type);
        const isActive = userReaction?.reaction_type === type;

        return (
          <motion.button
            key={type}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleReaction(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              isActive
                ? `${color} bg-current/10 border-current`
                : 'border-[#1a1a2e]/10 text-[#1a1a2e]/60 hover:border-[#c17f59] hover:text-[#c17f59]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{count > 0 ? count : label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}