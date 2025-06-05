import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { postService } from '@/services/api/postService'
import PostCard from '@/components/organisms/PostCard'
import RefreshButton from '@/components/molecules/RefreshButton'
import StoryButton from '@/components/molecules/StoryButton'
import AnimatedIconBox from '@/components/molecules/AnimatedIconBox'
import Text from '@/components/atoms/Text'
import Shimmer from '@/components/atoms/Shimmer'
import Button from '@/components/atoms/Button'
import CommentsModal from '@/components/organisms/CommentsModal'
import ApperIcon from '@/components/ApperIcon'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())

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
      loadPosts() // Revert optimistic update on failure
    }
  }

  const handleCommentClick = (postId) => {
    setSelectedPostId(postId)
  }

  const handleCloseComments = () => {
    setSelectedPostId(null)
  }

  const handleCommentAdded = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, commentCount: (p.commentCount || 0) + 1 }
        : p
    ))
  }

  const renderSkeletonPost = () => (
    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
      <div className="flex items-center space-x-3 mb-3">
        <Shimmer className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Shimmer className="h-4 rounded mb-2 w-24" />
          <Shimmer className="h-3 rounded w-16" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <Shimmer className="h-4 rounded" />
        <Shimmer className="h-4 rounded w-3/4" />
      </div>
      <Shimmer className="h-48 rounded-xl mb-4" />
      <div className="flex items-center justify-between">
        <Shimmer className="h-8 rounded w-16" />
        <Shimmer className="h-8 rounded w-16" />
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
        <AnimatedIconBox iconName="AlertTriangle" bgColor="bg-red-100" iconColor="text-red-500" />
        <Text type="p" className="text-gray-500 mb-4">{error}</Text>
        <Button
          onClick={loadPosts}
          className="bg-primary text-white px-6 py-2 rounded-xl font-medium"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Stories Bar */}
      <div className="p-4 pb-2">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5].map(i => (
            <StoryButton key={i} />
          ))}
        </div>
      </div>

      {/* Pull to Refresh */}
      <RefreshButton refreshing={refreshing} onRefresh={handleRefresh} />

      {/* Posts Feed */}
      <div className="px-4 space-y-4">
        <AnimatePresence>
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              isLiked={likedPosts.has(post.id) || post.isLiked}
              onLike={handleLike}
              onComment={handleCommentClick}
              initialDelay={index * 0.1}
            />
          ))}
        </AnimatePresence>

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <AnimatedIconBox iconName="Users" bgColor="bg-gray-100" iconColor="text-gray-400" />
            <Text type="h3" className="text-lg font-semibold text-accent mb-2">No posts yet</Text>
            <Text type="p" className="text-gray-500">Be the first to share something amazing!</Text>
          </div>
        )}
      </div>

      <CommentsModal
        postId={selectedPostId}
        onClose={handleCloseComments}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  )
}

export default Feed