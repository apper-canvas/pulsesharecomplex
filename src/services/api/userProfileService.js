import userProfilesData from '../mockData/userProfiles.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let userProfiles = [...userProfilesData]

export const userProfileService = {
  async getAll() {
    await delay(300)
    return [...userProfiles]
  },

  async getById(id) {
    await delay(200)
    const profile = userProfiles.find(p => p.id === id)
    return profile ? { ...profile } : null
  },

  async getByUsername(username) {
    await delay(200)
    const profile = userProfiles.find(p => p.username === username)
    return profile ? { ...profile } : null
  },

  async create(profileData) {
    await delay(400)
    const newProfile = {
      id: Date.now(),
      postCount: 0,
      followerCount: 0,
      followingCount: 0,
      ...profileData
    }
    userProfiles.push(newProfile)
    return { ...newProfile }
  },

  async update(id, updateData) {
    await delay(300)
    const index = userProfiles.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Profile not found')
    
    userProfiles[index] = { ...userProfiles[index], ...updateData }
    return { ...userProfiles[index] }
  },

  async delete(id) {
    await delay(250)
    const index = userProfiles.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Profile not found')
    
    const deleted = userProfiles.splice(index, 1)[0]
    return { ...deleted }
  }
}