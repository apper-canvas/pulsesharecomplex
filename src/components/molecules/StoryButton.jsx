import React from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'

const StoryButton = () => {
  return (
    <Button
      onClick={() => toast.info('Stories launching soon!')}
      className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-full h-full bg-gray-200 rounded-full"></div>
    </Button>
  )
}

export default StoryButton