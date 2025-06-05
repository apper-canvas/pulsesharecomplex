import React from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const TabBarButton = ({ tab, isActive, onClick }) => {
  const iconSize = tab.id === 'create' ? 'w-8 h-8' : 'w-6 h-6'

  return (
    <Button
      key={tab.id}
      onClick={() => onClick(tab.id)}
      className={`flex flex-col items-center justify-center min-w-12 h-12 rounded-full ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-400 hover:text-accent'
      }`}
    >
      <ApperIcon
        name={tab.icon}
        className={`${iconSize}`}
      />
    </Button>
  )
}

export default TabBarButton