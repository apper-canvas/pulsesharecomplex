import { useState } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { motion, AnimatePresence } from 'framer-motion'

const Home = () => {
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
        return <MainFeature />
      case 'search':
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
              >
                <ApperIcon name="Search" className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-accent mb-2">Discover Amazing Content</h3>
              <p className="text-gray-500">Search functionality coming soon!</p>
            </div>
          </div>
        )
      case 'messages':
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center"
              >
                <ApperIcon name="MessageCircle" className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-accent mb-2">Direct Messages</h3>
              <p className="text-gray-500">Chat with friends - arriving next month!</p>
            </div>
          </div>
        )
      case 'profile':
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent to-gray-600 rounded-full flex items-center justify-center"
              >
                <ApperIcon name="User" className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-accent mb-2">Your Profile</h3>
              <p className="text-gray-500">Profile customization coming soon!</p>
            </div>
          </div>
        )
      default:
        return <MainFeature />
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-full hover:bg-gray-100 touch-manipulation"
          >
            <ApperIcon name="Bell" className="w-6 h-6 text-accent" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </motion.button>
        </div>
      </motion.header>

      {/* Content */}
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

      {/* Bottom Navigation */}
      <motion.nav 
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-gray-100"
      >
        <div className="h-20 max-w-md mx-auto px-4">
          <div className="flex items-center justify-around h-full">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center min-w-12 h-12 rounded-full touch-manipulation ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-accent'
                }`}
              >
                <ApperIcon 
                  name={tab.icon} 
                  className={`w-6 h-6 ${tab.id === 'create' ? 'w-8 h-8' : ''}`} 
                />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-96 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-accent">Create Post</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      placeholder="What's happening?"
                      className="w-full h-24 p-4 bg-gray-50 rounded-xl border-none resize-none text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={280}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      0/280
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                      <ApperIcon name="Camera" className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-gray-600">Photo</span>
                    </button>
                    <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 opacity-50">
                      <ApperIcon name="MapPin" className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-400">Location</span>
                    </button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-xl touch-manipulation"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Share
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home