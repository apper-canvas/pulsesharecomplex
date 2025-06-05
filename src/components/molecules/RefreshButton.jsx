import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'

const RefreshButton = ({ refreshing, onRefresh }) => {
  return (
    <div className="px-4">
      <Button
        onClick={onRefresh}
        disabled={refreshing}
        className="w-full mb-4 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
      >
        <div className="flex items-center justify-center space-x-2">
          <motion.div
            animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
          >
            <ApperIcon name="RefreshCw" className="w-5 h-5" />
          </motion.div>
          <Text type="span" className="font-medium">
            {refreshing ? 'Refreshing...' : 'Pull to refresh'}
          </Text>
        </div>
      </Button>
    </div>
  )
}

export default RefreshButton