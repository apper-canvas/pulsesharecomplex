import React from 'react'
import { motion } from 'framer-motion'

const Button = ({
  children,
  onClick,
  className = '',
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  disabled = false,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`touch-manipulation ${className}`}
      whileHover={whileHover}
      whileTap={whileTap}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button