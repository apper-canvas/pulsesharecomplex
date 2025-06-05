import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const IconText = ({
  iconName,
  text,
  iconClassName = '',
  textClassName = '',
  containerClassName = '',
  animateIcon = false,
  animationProps = {},
  onClick,
  disabled,
  ...props
}) => {
  const commonButtonProps = {
    onClick: onClick,
    disabled: disabled,
    className: `flex items-center space-x-2 ${onClick ? 'touch-manipulation' : ''} ${containerClassName}`
  }

  const iconComponent = (
    <ApperIcon name={iconName} className={`w-6 h-6 ${iconClassName}`} />
  )

  return (
    <motion.button {...commonButtonProps} {...props}>
      {animateIcon ? (
        <motion.div {...animationProps}>
          {iconComponent}
        </motion.div>
      ) : (
        iconComponent
      )}
      {text && <span className={`text-sm font-medium ${textClassName}`}>{text}</span>}
    </motion.button>
  )
}

export default IconText