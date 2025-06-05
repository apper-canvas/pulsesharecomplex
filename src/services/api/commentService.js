const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'Comment1';

// All fields for display (including system fields)
const allFields = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'content', 'timestamp', 'username', 'post_id'
];

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'content', 'timestamp', 'username', 'post_id'
];

export const commentService = {
  async getAll() {
    try {
      const params = {
        fields: allFields,
        orderBy: [
          {
            fieldName: "timestamp",
            SortType: "ASC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to expected UI format
      return response.data.map(comment => ({
        id: comment.Id,
        postId: comment.post_id || null,
        content: comment.content || '',
        timestamp: comment.timestamp || comment.CreatedOn,
        username: comment.username || 'Anonymous'
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
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

      const comment = response.data;
      return {
        id: comment.Id,
        postId: comment.post_id || null,
        content: comment.content || '',
        timestamp: comment.timestamp || comment.CreatedOn,
        username: comment.username || 'Anonymous'
      };
    } catch (error) {
      console.error(`Error fetching comment with ID ${id}:`, error);
      return null;
    }
  },

  async getByPostId(postId) {
    try {
      const params = {
        fields: allFields,
        where: [
          {
            fieldName: "post_id",
            operator: "ExactMatch",
            values: [postId.toString()]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            SortType: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to expected UI format
      return response.data.map(comment => ({
        id: comment.Id,
        postId: comment.post_id || null,
        content: comment.content || '',
        timestamp: comment.timestamp || comment.CreatedOn,
        username: comment.username || 'Anonymous'
      }));
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return [];
    }
  },

  async create(commentData) {
    try {
      // Map UI field names to database field names
      const record = {
        Name: 'Comment',
        content: commentData.content || '',
        timestamp: new Date().toISOString(),
        username: commentData.username || 'Anonymous',
        post_id: commentData.postId?.toString() || null
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
            postId: created.post_id || null,
            content: created.content || '',
            timestamp: created.timestamp || created.CreatedOn,
            username: created.username || 'Anonymous'
          };
        }
      }
      
      throw new Error('Failed to create comment');
    } catch (error) {
      console.error("Error creating comment:", error);
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
      if (updateData.username !== undefined) record.username = updateData.username;
      if (updateData.postId !== undefined) record.post_id = updateData.postId?.toString();

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
            postId: updated.post_id || null,
            userId: updated.user_id || null,
            parentCommentId: updated.parent_comment_id || null,
            content: updated.content || '',
            timestamp: updated.CreatedOn,
            likeCount: updated.like_count || 0,
            replyCount: updated.reply_count || 0,
            isEdited: updated.is_edited || false
          };
        }
      }
      
      throw new Error('Failed to update comment');
    } catch (error) {
      console.error("Error updating comment:", error);
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
      
      throw new Error('Failed to delete comment');
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
}