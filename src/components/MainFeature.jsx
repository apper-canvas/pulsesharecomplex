import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { postService } from '../services/api/postService'
import { commentService } from '../services/api/commentService'
import { formatDistanceToNow } from 'date-fns'

const MainFeature = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [likedPosts, setLikedPosts] = useState(new Set())

  // Load posts
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await postService.getAll()
      setPosts(result || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadPosts()
      toast.success('Feed refreshed!')
    } catch (err) {
      toast.error('Failed to refresh')
    } finally {
      setRefreshing(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const isLiked = likedPosts.has(postId)
      const newLikeCount = isLiked ? post.likeCount - 1 : post.likeCount + 1
      
      // Optimistic update
      setLikedPosts(prev => {
        const newSet = new Set(prev)
        if (isLiked) {
          newSet.delete(postId)
        } else {
          newSet.add(postId)
        }
        return newSet
      })

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, likeCount: newLikeCount, isLiked: !isLiked }
          : p
      ))

      await postService.update(postId, { 
        likeCount: newLikeCount,
        isLiked: !isLiked 
      })

      toast.success(isLiked ? 'Unliked post' : 'Liked post!')
    } catch (err) {
      toast.error('Failed to update like')
      // Revert optimistic update
      loadPosts()
    }
  }

  const handleComment = async (postId) => {
    setSelectedPost(postId)
    try {
      const result = await commentService.getAll()
      const postComments = result?.filter(c => c.postId === postId) || []
      setComments(postComments)
    } catch (err) {
      toast.error('Failed to load comments')
      setComments([])
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return

    try {
      const comment = {
        postId: selectedPost,
        content: newComment.trim(),
        username: 'You',
        timestamp: new Date().toISOString()
      }

      const savedComment = await commentService.create(comment)
      setComments(prev => [...(prev || []), savedComment])
      
      // Update comment count
      setPosts(prev => prev.map(p => 
        p.id === selectedPost 
          ? { ...p, commentCount: p.commentCount + 1 }
          : p
      ))

      setNewComment('')
      toast.success('Comment added!')
    } catch (err) {
      toast.error('Failed to add comment')
    }
  }

  const renderSkeletonPost = () => (
    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded shimmer mb-2 w-24"></div>
          <div className="h-3 bg-gray-200 rounded shimmer w-16"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded shimmer"></div>
        <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
      </div>
      <div className="h-48 bg-gray-200 rounded-xl shimmer mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded shimmer w-16"></div>
        <div className="h-8 bg-gray-200 rounded shimmer w-16"></div>
      </div>
    </div>
  )

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4">
        {[1, 2, 3].map(i => (
          <div key={i}>{renderSkeletonPost()}</div>
        ))}
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-500" />
        </motion.div>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadPosts}
          className="bg-primary text-white px-6 py-2 rounded-xl font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Stories Bar */}
      <div className="p-4 pb-2">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5"
              onClick={() => toast.info('Stories launching soon!')}
            >
              <div className="w-full h-full bg-gray-200 rounded-full"></div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pull to Refresh */}
      <div className="px-4">
        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mb-4 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
            >
              <ApperIcon name="RefreshCw" className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">
              {refreshing ? 'Refreshing...' : 'Pull to refresh'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Posts Feed */}
      <div className="px-4 space-y-4">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {post.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-accent">{post.username || 'User'}</h3>
                    <p className="text-xs text-gray-500">
                      {post.timestamp ? formatDistanceToNow(new Date(post.timestamp), { addSuffix: true }) : 'Just now'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              {post.content && (
                <div className="px-4 pb-3">
                  <p className="text-accent leading-relaxed">{post.content}</p>
                </div>
              )}

              {/* Post Image */}
              {post.imageUrl && (
                <div className="relative">
                  <img
                    src={post.imageUrl}
                    alt="Post content"
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="p-4 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <motion.button
                      onClick={() => handleLike(post.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center space-x-2 touch-manipulation ${
                        likedPosts.has(post.id) || post.isLiked
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <motion.div
                        animate={likedPosts.has(post.id) || post.isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ApperIcon 
                          name={likedPosts.has(post.id) || post.isLiked ? 'Heart' : 'Heart'} 
                          className={`w-6 h-6 ${likedPosts.has(post.id) || post.isLiked ? 'fill-current' : ''}`}
                        />
                      </motion.div>
                      <span className="text-sm font-medium">{post.likeCount || 0}</span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleComment(post.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-2 text-gray-400 hover:text-secondary touch-manipulation"
                    >
                      <ApperIcon name="MessageCircle" className="w-6 h-6" />
                      <span className="text-sm font-medium">{post.commentCount || 0}</span>
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toast.info('Share feature coming soon!')}
                    className="text-gray-400 hover:text-accent touch-manipulation"
                  >
                    <ApperIcon name="Share" className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <ApperIcon name="Users" className="w-8 h-8 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-accent mb-2">No posts yet</h3>
            <p className="text-gray-500">Be the first to share something amazing!</p>
          </div>
        )}
      </div>

      {/* Comments Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setSelectedPost(null)}
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
                <h3 className="font-semibold text-accent">Comments</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No comments yet. Be the first!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">
                          {comment.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <h4 className="font-medium text-accent text-sm">{comment.username || 'User'}</h4>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-3">
                          {comment.timestamp ? formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true }) : 'Just now'}
                        </p>
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
                  <motion.button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature