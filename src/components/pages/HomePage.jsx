import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlobalHeader from '@/components/organisms/GlobalHeader'
import TabBar from '@/components/organisms/TabBar'
import CreatePostModal from '@/components/organisms/CreatePostModal'
import Feed from '@/components/organisms/Feed'
import FeaturePlaceholder from '@/components/molecules/FeaturePlaceholder'

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const tabs = [
    { id: 'home', icon: 'Home', label: 'Home' },
    { id: 'search', icon: 'Search', label: 'Search' },
    { id: 'create', icon: 'Plus', label: 'Create' },
    { id: 'messages', icon: 'MessageCircle', label: 'Messages' },
    { id: 'profile', icon: 'User', label: 'Profile' }
  ]

  const handleTabClick = (tabId) => {
    if (tabId === 'create') {
      setShowCreateModal(true)
    } else {
      setActiveTab(tabId)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <Feed />
      case 'search':
        return (
          <FeaturePlaceholder
            iconName="Search"
            iconBgColor="bg-gradient-to-br from-primary to-secondary"
            title="Discover Amazing Content"
            description="Search functionality coming soon!"
          />
        )
      case 'messages':
        return (
          <FeaturePlaceholder
            iconName="MessageCircle"
            iconBgColor="bg-gradient-to-br from-secondary to-primary"
            title="Direct Messages"
            description="Chat with friends - arriving next month!"
          />
        )
      case 'profile':
        return (
          <FeaturePlaceholder
            iconName="User"
            iconBgColor="bg-gradient-to-br from-accent to-gray-600"
            title="Your Profile"
            description="Profile customization coming soon!"
          />
        )
      default:
        return <Feed />
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalHeader />

      <main className="flex-1 pt-14 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <TabBar tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

      <CreatePostModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
}

export default HomePage