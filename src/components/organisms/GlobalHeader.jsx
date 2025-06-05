import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Pill from '@/components/atoms/Pill'

const GlobalHeader = () => {
  return (
    <motion.header
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-100"
    >
      <div className="h-14 flex items-center justify-between px-4 max-w-md mx-auto">
        <motion.h1
          className="text-xl font-bold gradient-text"
          whileHover={{ scale: 1.05 }}
        >
          PulseShare
        </motion.h1>
        <Button
          onClick={() => toast.info('Notifications coming soon!')}
          className="relative p-2 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Bell" className="w-6 h-6 text-accent" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Pill text="!" />
          </div>
        </Button>
      </div>
    </motion.header>
  )
}

export default GlobalHeader