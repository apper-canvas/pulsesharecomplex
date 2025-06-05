import React from 'react'
import { motion } from 'framer-motion'
import TabBarButton from '@/components/molecules/TabBarButton'

const TabBar = ({ tabs, activeTab, onTabClick }) => {
  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-gray-100"
    >
      <div className="h-20 max-w-md mx-auto px-4">
        <div className="flex items-center justify-around h-full">
          {tabs.map((tab) => (
            <TabBarButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={onTabClick}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

export default TabBar