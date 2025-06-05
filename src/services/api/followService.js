const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'follows';

// All fields for display (including system fields and relationships)
const allFields = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'follower_id', 'following_id', 'status'
];

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'follower_id', 'following_id', 'status'
];

export const followService = {
  async getAll() {
    try {
      const params = {
        fields: allFields,
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ],
        pagingInfo: {
          limit: 1000,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to expected UI format
      return response.data.map(follow => ({
        id: follow.Id,
        followerId: follow.follower_id,
        followingId: follow.following_id,
        status: follow.status || 'accepted',
        timestamp: follow.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching follows:", error);
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

      const follow = response.data;
      return {
        id: follow.Id,
        followerId: follow.follower_id,
        followingId: follow.following_id,
        status: follow.status || 'accepted',
        timestamp: follow.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching follow with ID ${id}:`, error);
      return null;
    }
  },

  async getFollowers(userId) {
    try {
      const params = {
        fields: allFields,
        where: [
          {
            fieldName: "following_id",
            operator: "ExactMatch",
            values: [userId.toString()]
          },
          {
            fieldName: "status",
            operator: "ExactMatch",
            values: ["accepted"]
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to expected UI format
      return response.data.map(follow => ({
        id: follow.Id,
        followerId: follow.follower_id,
        followingId: follow.following_id,
        status: follow.status || 'accepted',
        timestamp: follow.CreatedOn
      }));
    } catch (error) {
      console.error(`Error fetching followers for user ${userId}:`, error);
      return [];
    }
  },

  async getFollowing(userId) {
    try {
      const params = {
        fields: allFields,
        where: [
          {
            fieldName: "follower_id",
            operator: "ExactMatch",
            values: [userId.toString()]
          },
          {
            fieldName: "status",
            operator: "ExactMatch",
            values: ["accepted"]
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to expected UI format
      return response.data.map(follow => ({
        id: follow.Id,
        followerId: follow.follower_id,
        followingId: follow.following_id,
        status: follow.status || 'accepted',
        timestamp: follow.CreatedOn
      }));
    } catch (error) {
      console.error(`Error fetching following for user ${userId}:`, error);
      return [];
    }
  },

  async getFollowRelationship(followerId, followingId) {
    try {
      const params = {
        fields: allFields,
        where: [
          {
            fieldName: "follower_id",
            operator: "ExactMatch",
            values: [followerId.toString()]
          },
          {
            fieldName: "following_id",
            operator: "ExactMatch",
            values: [followingId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return null;
      }

      const follow = response.data[0];
      return {
        id: follow.Id,
        followerId: follow.follower_id,
        followingId: follow.following_id,
        status: follow.status || 'accepted',
        timestamp: follow.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching follow relationship between ${followerId} and ${followingId}:`, error);
      return null;
    }
  },

  async create(followData) {
    try {
      // Prevent self-following
      if (followData.followerId === followData.followingId) {
        throw new Error('Users cannot follow themselves');
      }

      // Check if follow relationship already exists
      const existingFollow = await this.getFollowRelationship(
        followData.followerId,
        followData.followingId
      );

      if (existingFollow) {
        return existingFollow; // Return existing follow instead of creating duplicate
      }

      // Map UI field names to database field names
      const record = {
        Name: 'Follow',
        follower_id: followData.followerId?.toString(),
        following_id: followData.followingId?.toString(),
        status: followData.status || 'accepted'
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
            followerId: created.follower_id,
            followingId: created.following_id,
            status: created.status || 'accepted',
            timestamp: created.CreatedOn
          };
        }
      }
      
      throw new Error('Failed to create follow');
    } catch (error) {
      console.error("Error creating follow:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const record = {
        Id: id
      };
      
      // Map UI field names to database field names for updateable fields only
      if (updateData.status !== undefined) record.status = updateData.status;

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
            followerId: updated.follower_id,
            followingId: updated.following_id,
            status: updated.status || 'accepted',
            timestamp: updated.CreatedOn
          };
        }
      }
      
      throw new Error('Failed to update follow');
    } catch (error) {
      console.error("Error updating follow:", error);
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
      
      throw new Error('Failed to delete follow');
    } catch (error) {
      console.error("Error deleting follow:", error);
      throw error;
    }
  },

  async unfollow(followerId, followingId) {
    try {
      const existingFollow = await this.getFollowRelationship(followerId, followingId);
      
      if (!existingFollow) {
        return true; // Already doesn't exist
      }

      return await this.delete(existingFollow.id);
    } catch (error) {
      console.error(`Error unfollowing user ${followingId} by user ${followerId}:`, error);
      throw error;
    }
  }
};