import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../../api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, User, Clock, Reply, AlertCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';

const MAX_COMMENT_LENGTH = 250;

export default function CommentSection({ postId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [formError, setFormError] = useState('');
  const queryClient = useQueryClient();

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => base44.entities.Comment.filter({ post_id: postId }),
    select: (data) => data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)),
  });

  const createCommentMutation = useMutation({
    mutationFn: (commentData) => base44.entities.Comment.create(commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setComment('');
      setReplyText('');
      setReplyingTo(null);
      setFormError('');
    },
  });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !comment) {
      setFormError('Please provide your name, a valid email, and a comment.');
      return;
    }

    if (!isValidEmail(email)) {
      setFormError('Please provide a valid email address.');
      return;
    }

    if (comment.length > MAX_COMMENT_LENGTH) {
      setFormError(`Comment exceeds the maximum limit of ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }

    createCommentMutation.mutate({
      post_id: postId,
      author_name: name,
      author_email: email,
      content: comment,
    });
  };

  const handleSubmitReply = (parentId) => {
    setFormError('');

    if (!name || !email || !replyText) {
      setFormError('Please provide your name, a valid email, and a reply.');
      return;
    }

    if (!isValidEmail(email)) {
      setFormError('Please provide a valid email address.');
      return;
    }

    if (replyText.length > MAX_COMMENT_LENGTH) {
      setFormError(`Reply exceeds the maximum limit of ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }

    createCommentMutation.mutate({
      post_id: postId,
      author_name: name,
      author_email: email,
      content: replyText,
      parent_id: parentId,
    });
  };

  const topLevelComments = comments.filter(c => !c.parent_id && !c.parent_comment_id);
  const getReplies = (commentId) => 
    comments.filter(c => c.parent_id === commentId || c.parent_comment_id === commentId);

  return (
    <div className="mt-16 pt-12 border-t border-[#1a1a2e]/10">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6 text-[#c17f59]" />
        <h3 className="text-2xl font-light text-[#1a1a2e]">
          Comments <span className="text-[#c17f59]">({comments.length})</span>
        </h3>
      </div>

      {/* Comment Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmitComment}
        className="bg-[#f4e8d8] rounded-2xl p-6 mb-10"
      >
        <h4 className="text-lg text-[#1a1a2e] mb-4">Join the conversation</h4>
        {formError && (
          <p className="text-sm text-red-600 mb-4">{formError}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            id="comment-name"
            name="name"
            type="text"
            placeholder="Your name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white border-[#1a1a2e]/10"
            required
          />
          <Input
            id="comment-email"
            name="email"
            type="email"
            placeholder="Your email (required — will not be displayed)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border-[#1a1a2e]/10"
            required
            aria-describedby="comment-email-note"
          />
          <p id="comment-email-note" className="text-xs text-[#1a1a2e]/60">We collect your email for moderation and contact only; it will not be shown publicly.</p>
        </div>

        <Textarea
          id="comment-text"
          name="comment"
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`bg-white border-[#1a1a2e]/10 min-h-[120px] mb-2 ${
            comment.length > MAX_COMMENT_LENGTH ? 'border-red-500' : ''
          }`}
          required
          maxLength={MAX_COMMENT_LENGTH + 1}
        />
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs ${
            comment.length > MAX_COMMENT_LENGTH 
              ? 'text-red-600 font-semibold' 
              : 'text-[#1a1a2e]/60'
          }`}>
            {comment.length} / {MAX_COMMENT_LENGTH} characters
          </span>
          {comment.length > MAX_COMMENT_LENGTH && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Exceeds limit
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={createCommentMutation.isPending || !name || !isValidEmail(email) || !comment || comment.length > MAX_COMMENT_LENGTH}
          className="bg-[#c17f59] hover:bg-[#a66b48] text-white"
        >
          {createCommentMutation.isPending ? (
            <>Posting...</>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </>
          )}
        </Button>
      </motion.form>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {isLoading ? (
            <div className="text-center py-8 text-[#1a1a2e]/50">Loading comments...</div>
          ) : topLevelComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-[#1a1a2e]/20 mx-auto mb-3" />
              <p className="text-[#1a1a2e]/50">Be the first to comment!</p>
            </div>
          ) : (
            topLevelComments.map((commentItem, index) => (
              <motion.div
                key={commentItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                {/* Comment Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#c17f59]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#c17f59]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-[#1a1a2e]">{commentItem.author_name}</span>
                      <span className="text-xs text-[#1a1a2e]/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(commentItem.created_date), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[#1a1a2e]/70 leading-relaxed">{commentItem.content}</p>
                  </div>
                </div>

                {/* Reply Button */}
                <button
                  onClick={() => setReplyingTo(replyingTo === commentItem.id ? null : commentItem.id)}
                  className="text-sm text-[#c17f59] hover:text-[#a66b48] flex items-center gap-1 ml-14"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>

                {/* Reply Form */}
                {replyingTo === commentItem.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-14 mt-4 bg-[#f4e8d8] rounded-lg p-4"
                  >
                    <Textarea
                      id={`reply-text-${commentItem.id}`}
                      name="reply"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className={`bg-white border-[#1a1a2e]/10 min-h-[80px] mb-2 ${
                        replyText.length > MAX_COMMENT_LENGTH ? 'border-red-500' : ''
                      }`}
                      maxLength={MAX_COMMENT_LENGTH + 1}
                    />
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs ${
                        replyText.length > MAX_COMMENT_LENGTH 
                          ? 'text-red-600 font-semibold' 
                          : 'text-[#1a1a2e]/60'
                      }`}>
                        {replyText.length} / {MAX_COMMENT_LENGTH} characters
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSubmitReply(commentItem.id)}
                        disabled={createCommentMutation.isPending || !replyText || !name || !isValidEmail(email) || replyText.length > MAX_COMMENT_LENGTH}
                        className="bg-[#c17f59] hover:bg-[#a66b48] text-white text-sm"
                      >
                        Post Reply
                      </Button>
                      <Button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        variant="outline"
                        className="text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Replies */}
                {getReplies(commentItem.id).length > 0 && (
                  <div className="ml-14 mt-4 space-y-4">
                    {getReplies(commentItem.id).map((reply) => (
                      <div key={reply.id} className="bg-[#faf9f7] rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#c17f59]/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-[#c17f59]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-medium text-[#1a1a2e] text-sm">{reply.author_name}</span>
                              <span className="text-xs text-[#1a1a2e]/40 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(reply.created_date), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-[#1a1a2e]/70 text-sm leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}