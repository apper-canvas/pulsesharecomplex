import React from 'react'
import AnimatedIconBox from '@/components/molecules/AnimatedIconBox'
import Text from '@/components/atoms/Text'

const FeaturePlaceholder = ({ iconName, iconBgColor, title, description }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <AnimatedIconBox iconName={iconName} bgColor={iconBgColor} iconColor="text-white" />
        <Text type="h3" className="text-xl font-bold text-accent mb-2">{title}</Text>
        <Text type="p" className="text-gray-500">{description}</Text>
      </div>
    </div>
  )
}

export default FeaturePlaceholder