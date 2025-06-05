import React from 'react'
import { motion } from 'framer-motion'
import PostHeader from '@/components/molecules/PostHeader'
import PostActions from '@/components/molecules/PostActions'
import Image from '@/components/atoms/Image'
import Text from '@/components/atoms/Text'

const PostCard = ({ post, isLiked, onLike, onComment, initialDelay }) => {
  return (
    <motion.article
      key={post.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: initialDelay }}
      className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden"
    >
      <PostHeader username={post.username} timestamp={post.timestamp} />

      {post.content && (
        <div className="px-4 pb-3">
          <Text type="p" className="text-accent leading-relaxed">{post.content}</Text>
        </div>
      )}

      {post.imageUrl && (
        <Image src={post.imageUrl} alt="Post content" />
      )}

      <PostActions
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        onLike={onLike}
        onComment={onComment}
        isLiked={isLiked}
      />
    </motion.article>
  )
}

export default PostCard