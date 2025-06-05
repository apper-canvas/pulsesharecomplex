import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '@/components/atoms/Avatar'
import Text from '@/components/atoms/Text'

const PostHeader = ({ username, timestamp }) => {
  const timeAgo = timestamp
    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    : 'Just now'

  return (
    <div className="p-4 pb-3">
      <div className="flex items-center space-x-3">
        <Avatar char={username} size="10" fromColor="primary" toColor="secondary" />
        <div className="flex-1">
          <Text type="h3" className="font-semibold text-accent">{username || 'User'}</Text>
          <Text type="p" className="text-xs text-gray-500">{timeAgo}</Text>
        </div>
      </div>
    </div>
  )
}

export default PostHeader