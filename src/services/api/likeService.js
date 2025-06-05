const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'likes';

// All fields for display (including system fields and relationships)
const allFields = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'user_id', 'target_type', 'target_id'
];

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'user_id', 'target_type', 'target_id'
];

export const likeService = {
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
      return response.data.map(like => ({
        id: like.Id,
        userId: like.user_id,
        targetType: like.target_type,
        targetId: like.target_id,
        timestamp: like.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching likes:", error);
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

      const like = response.data;
      return {
        id: like.Id,
        userId: like.user_id,
        targetType: like.target_type,
        targetId: like.target_id,
        timestamp: like.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching like with ID ${id}:`, error);
      return null;
    }
  },

  async getByTarget(targetType, targetId) {
    try {
      const params = {
        fields: allFields,
        where: [
          {
            fieldName: "target_type",
            operator: "ExactMatch",
            values: [targetType]
          },
          {
            fieldName: "target_id",
            operator: "ExactMatch",
            values: [targetId.toString()]
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
      return response.data.map(like => ({
        id: like.Id,
        userId: like.user_id,
        targetType: like.target_type,
        targetId: like.target_id,
        timestamp: like.CreatedOn
      }));
    } catch (error) {
      console.error(`Error fetching likes for ${targetType} ${targetId}:`, error);
      return [];
    }
  },

  async getByUserAndTarget(userId, targetType, targetId) {
    try {
      const params = {
        fields: allFields,
        where: [
          {
            fieldName: "user_id",
            operator: "ExactMatch",
            values: [userId.toString()]
          },
          {
            fieldName: "target_type",
            operator: "ExactMatch",
            values: [targetType]
          },
          {
            fieldName: "target_id",
            operator: "ExactMatch",
            values: [targetId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return null;
      }

      const like = response.data[0];
      return {
        id: like.Id,
        userId: like.user_id,
        targetType: like.target_type,
        targetId: like.target_id,
        timestamp: like.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching like for user ${userId} on ${targetType} ${targetId}:`, error);
      return null;
    }
  },

  async create(likeData) {
    try {
      // Check if like already exists to prevent duplicates
      const existingLike = await this.getByUserAndTarget(
        likeData.userId,
        likeData.targetType,
        likeData.targetId
      );

      if (existingLike) {
        return existingLike; // Return existing like instead of creating duplicate
      }

      // Map UI field names to database field names
      const record = {
        Name: `Like on ${likeData.targetType}`,
        user_id: likeData.userId?.toString(),
        target_type: likeData.targetType,
        target_id: likeData.targetId?.toString()
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
            userId: created.user_id,
            targetType: created.target_type,
            targetId: created.target_id,
            timestamp: created.CreatedOn
          };
        }
      }
      
      throw new Error('Failed to create like');
    } catch (error) {
      console.error("Error creating like:", error);
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
      
      throw new Error('Failed to delete like');
    } catch (error) {
      console.error("Error deleting like:", error);
      throw error;
    }
  },

  async deleteByUserAndTarget(userId, targetType, targetId) {
    try {
      const existingLike = await this.getByUserAndTarget(userId, targetType, targetId);
      
      if (!existingLike) {
        return true; // Already doesn't exist
      }

      return await this.delete(existingLike.id);
    } catch (error) {
      console.error(`Error removing like for user ${userId} on ${targetType} ${targetId}:`, error);
      throw error;
    }
  }
};