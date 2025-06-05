import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import PrimaryButton from '@/components/molecules/PrimaryButton'

const CreatePostModal = ({ show, onClose }) => {
  const [postContent, setPostContent] = useState('')
  const MAX_LENGTH = 280

  const handleShare = () => {
    // Implement post sharing logic here
    console.log('Sharing post:', postContent)
    setPostContent('') // Clear input after sharing
    onClose()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-96 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Text type="h3" className="text-lg font-bold text-accent">Create Post</Text>
                <Button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                  <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    placeholder="What's happening?"
                    className="w-full h-24 p-4 bg-gray-50 rounded-xl border-none resize-none text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={MAX_LENGTH}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <Text type="span" className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {postContent.length}/{MAX_LENGTH}
                  </Text>
                </div>

                <div className="flex items-center space-x-4">
                  <Button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                    <ApperIcon name="Camera" className="w-5 h-5 text-secondary" />
                    <Text type="span" className="text-sm text-gray-600">Photo</Text>
                  </Button>
                  <Button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 opacity-50" disabled>
                    <ApperIcon name="MapPin" className="w-5 h-5 text-gray-400" />
                    <Text type="span" className="text-sm text-gray-400">Location</Text>
                  </Button>
                </div>

                <PrimaryButton onClick={handleShare} disabled={!postContent.trim()}>
                  Share
                </PrimaryButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreatePostModal