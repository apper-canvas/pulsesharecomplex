import React from 'react'
import { motion } from 'framer-motion'

const Avatar = ({ char, imageUrl, size = '10', fromColor, toColor, className = '' }) => {
  const avatarClasses = `w-${size} h-${size} rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`
  const textClasses = `text-white font-bold text-sm`

  if (imageUrl) {
    return (
      <motion.div
        className={`${avatarClasses} bg-gray-200 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img src={imageUrl} alt="User Avatar" className="w-full h-full object-cover" />
      </motion.div>
    )
  }

  const backgroundGradient = fromColor && toColor
    ? `bg-gradient-to-br from-${fromColor} to-${toColor}`
    : 'bg-gray-400' // Default if no gradient specified

  return (
    <motion.div
      className={`${avatarClasses} ${backgroundGradient} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className={textClasses}>
        {char ? char.charAt(0).toUpperCase() : 'U'}
      </span>
    </motion.div>
  )
}

export default Avatar