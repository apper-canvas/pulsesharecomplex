import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import { commentService } from '@/services/api/commentService'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Avatar from '@/components/atoms/Avatar'
import PrimaryButton from '@/components/molecules/PrimaryButton'

const CommentsModal = ({ postId, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const loadComments = async () => {
      try {
        const result = await commentService.getAll()
        const postComments = result?.filter(c => c.postId === postId) || []
        setComments(postComments)
      } catch (err) {
        toast.error('Failed to load comments')
        setComments([])
      }
    }
    if (postId) {
      loadComments()
    }
  }, [postId])

  const handleAddComment = async () => {
    if (!newComment.trim() || !postId) return

    try {
      const comment = {
        postId: postId,
        content: newComment.trim(),
        username: 'You',
        timestamp: new Date().toISOString()
      }

      const savedComment = await commentService.create(comment)
      setComments(prev => [...(prev || []), savedComment])
      setNewComment('')
      toast.success('Comment added!')
      onCommentAdded(postId)
    } catch (err) {
      toast.error('Failed to add comment')
    }
  }

  return (
    <AnimatePresence>
      {postId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-96 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Comments Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Text type="h3" className="font-semibold text-accent">Comments</Text>
              <Button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
              </Button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <Text type="p" className="text-gray-500">No comments yet. Be the first!</Text>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar char={comment.username} size="8" fromColor="secondary" toColor="primary" />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <Text type="h4" className="font-medium text-accent text-sm">{comment.username || 'User'}</Text>
                        <Text type="p" className="text-gray-700 text-sm">{comment.content}</Text>
                      </div>
                      <Text type="p" className="text-xs text-gray-500 mt-1 ml-3">
                        {comment.timestamp ? formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true }) : 'Just now'}
                      </Text>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={200}
                />
                <PrimaryButton
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-6 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send
                </PrimaryButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommentsModal