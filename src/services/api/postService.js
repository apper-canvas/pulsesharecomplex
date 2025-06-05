const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'post';

// All fields for display (including system fields)
const allFields = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'content', 'image_url', 'timestamp', 'username', 'like_count', 'comment_count', 'is_liked'
];

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'content', 'image_url', 'timestamp', 'username', 'like_count', 'comment_count', 'is_liked'
];

export const postService = {
  async getAll() {
    try {
      const params = {
        fields: allFields,
        orderBy: [
          {
            fieldName: "timestamp",
            SortType: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to expected UI format
      return response.data.map(post => ({
        id: post.Id,
        content: post.content || '',
        imageUrl: post.image_url || '',
        timestamp: post.timestamp || post.CreatedOn,
        username: post.username || 'Anonymous',
        likeCount: post.like_count || 0,
        commentCount: post.comment_count || 0,
        isLiked: post.is_liked || false
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: allFields
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const post = response.data;
      return {
        id: post.Id,
        content: post.content || '',
        imageUrl: post.image_url || '',
        timestamp: post.timestamp || post.CreatedOn,
        username: post.username || 'Anonymous',
        likeCount: post.like_count || 0,
        commentCount: post.comment_count || 0,
        isLiked: post.is_liked || false
      };
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      return null;
    }
  },

  async create(postData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      updateableFields.forEach(field => {
        if (postData[field] !== undefined) {
          filteredData[field] = postData[field];
        }
      });

      // Map UI field names to database field names
      const record = {
        Name: postData.title || 'Post',
        content: postData.content || '',
        image_url: postData.imageUrl || '',
        timestamp: new Date().toISOString(),
        username: postData.username || 'You',
        like_count: 0,
        comment_count: 0,
        is_liked: false
      };

      const params = {
        records: [record]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            id: created.Id,
            content: created.content || '',
            imageUrl: created.image_url || '',
            timestamp: created.timestamp || created.CreatedOn,
            username: created.username || 'You',
            likeCount: created.like_count || 0,
            commentCount: created.comment_count || 0,
            isLiked: created.is_liked || false
          };
        }
      }
      
      throw new Error('Failed to create post');
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      // Filter to only include updateable fields
      const record = {
        Id: id
      };
// Map UI field names to database field names for updateable fields only
      if (updateData.content !== undefined) record.content = updateData.content;
      if (updateData.imageUrl !== undefined) record.image_url = updateData.imageUrl;
      if (updateData.videoUrl !== undefined) record.video_url = updateData.videoUrl;
      if (updateData.postType !== undefined) record.post_type = updateData.postType;
      if (updateData.likeCount !== undefined) record.like_count = updateData.likeCount;
      if (updateData.commentCount !== undefined) record.comment_count = updateData.commentCount;
      if (updateData.shareCount !== undefined) record.share_count = updateData.shareCount;
      if (updateData.isPublic !== undefined) record.is_public = updateData.isPublic;
      if (updateData.hashtags !== undefined) record.hashtags = JSON.stringify(updateData.hashtags);
      if (updateData.mentions !== undefined) record.mentions = JSON.stringify(updateData.mentions);
      if (updateData.location !== undefined) record.location = updateData.location;

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updated = successfulUpdates[0].data;
          return {
            id: updated.Id,
            userId: updated.user_id,
            content: updated.content || '',
            imageUrl: updated.image_url || '',
            videoUrl: updated.video_url || '',
            postType: updated.post_type || 'text',
            timestamp: updated.CreatedOn,
            likeCount: updated.like_count || 0,
            commentCount: updated.comment_count || 0,
            shareCount: updated.share_count || 0,
            isPublic: updated.is_public !== false,
            hashtags: updated.hashtags ? JSON.parse(updated.hashtags) : [],
            mentions: updated.mentions ? JSON.parse(updated.mentions) : [],
            location: updated.location || ''
          };
        }
      }
      
      throw new Error('Failed to update post');
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (response && response.success) {
        return true;
      }
      
      throw new Error('Failed to delete post');
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
}