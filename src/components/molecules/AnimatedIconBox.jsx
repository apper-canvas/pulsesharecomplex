import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const AnimatedIconBox = ({
  iconName,
  bgColor,
  iconColor,
  iconSize = 'w-12 h-12',
  boxSize = 'w-24 h-24',
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${boxSize} mx-auto mb-6 ${bgColor} rounded-full flex items-center justify-center ${className}`}
      {...props}
    >
      <ApperIcon name={iconName} className={`${iconSize} ${iconColor}`} />
    </motion.div>
  )
}

export default AnimatedIconBox