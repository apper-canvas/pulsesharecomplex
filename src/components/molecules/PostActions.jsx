import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import IconText from '@/components/atoms/IconText'

const PostActions = ({ postId, likeCount, commentCount, onLike, onComment, isLiked }) => {
  return (
    <div className="p-4 pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <IconText
            onClick={() => onLike(postId)}
            iconName="Heart"
            text={likeCount || 0}
            containerClassName={`${
              isLiked
                ? 'text-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
            iconClassName={`${isLiked ? 'fill-current' : ''}`}
            animateIcon
            animationProps={{
              animate: isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 },
              transition: { duration: 0.3 }
            }}
          />

          <IconText
            onClick={() => onComment(postId)}
            iconName="MessageCircle"
            text={commentCount || 0}
            containerClassName="text-gray-400 hover:text-secondary"
          />
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
  )
}

export default PostActions