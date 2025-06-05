const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'user_profile';

// All fields for display (including system fields)
const allFields = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'username', 'avatar', 'bio', 'post_count', 'follower_count', 'following_count'
];

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'username', 'avatar', 'bio', 'post_count', 'follower_count', 'following_count'
];

export const userProfileService = {
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
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to expected UI format
      return response.data.map(profile => ({
        id: profile.Id,
        username: profile.username || 'Anonymous',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        postCount: profile.post_count || 0,
        followerCount: profile.follower_count || 0,
        followingCount: profile.following_count || 0
      }));
    } catch (error) {
      console.error("Error fetching user profiles:", error);
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

      const profile = response.data;
      return {
        id: profile.Id,
        username: profile.username || 'Anonymous',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        postCount: profile.post_count || 0,
        followerCount: profile.follower_count || 0,
        followingCount: profile.following_count || 0
      };
    } catch (error) {
      console.error(`Error fetching profile with ID ${id}:`, error);
      return null;
    }
  },

  async getByUsername(username) {
    try {
      const params = {
        fields: allFields,
        where: [
          {
            fieldName: "username",
            operator: "ExactMatch",
            values: [username]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return null;
      }

      const profile = response.data[0];
      return {
        id: profile.Id,
        username: profile.username || 'Anonymous',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        postCount: profile.post_count || 0,
        followerCount: profile.follower_count || 0,
        followingCount: profile.following_count || 0
      };
    } catch (error) {
      console.error(`Error fetching profile by username ${username}:`, error);
      return null;
    }
  },

  async create(profileData) {
    try {
      // Map UI field names to database field names
      const record = {
        Name: profileData.username || 'User Profile',
        username: profileData.username || 'Anonymous',
        avatar: profileData.avatar || '',
        bio: profileData.bio || '',
        post_count: profileData.postCount || 0,
        follower_count: profileData.followerCount || 0,
        following_count: profileData.followingCount || 0
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
            username: created.username || 'Anonymous',
            avatar: created.avatar || '',
            bio: created.bio || '',
            postCount: created.post_count || 0,
            followerCount: created.follower_count || 0,
            followingCount: created.following_count || 0
          };
        }
      }
      
      throw new Error('Failed to create profile');
    } catch (error) {
      console.error("Error creating profile:", error);
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
      if (updateData.username !== undefined) record.username = updateData.username;
      if (updateData.avatar !== undefined) record.avatar = updateData.avatar;
      if (updateData.bio !== undefined) record.bio = updateData.bio;
      if (updateData.postCount !== undefined) record.post_count = updateData.postCount;
      if (updateData.followerCount !== undefined) record.follower_count = updateData.followerCount;
      if (updateData.followingCount !== undefined) record.following_count = updateData.followingCount;

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
            username: updated.username || 'Anonymous',
            avatar: updated.avatar || '',
            bio: updated.bio || '',
            postCount: updated.post_count || 0,
            followerCount: updated.follower_count || 0,
            followingCount: updated.following_count || 0
          };
        }
      }
      
      throw new Error('Failed to update profile');
    } catch (error) {
      console.error("Error updating profile:", error);
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
      
      throw new Error('Failed to delete profile');
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  }
}