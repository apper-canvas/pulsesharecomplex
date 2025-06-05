import postsData from '../mockData/posts.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let posts = [...postsData]

export const postService = {
  async getAll() {
    await delay(300)
    return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async getById(id) {
    await delay(200)
    const post = posts.find(p => p.id === id)
    return post ? { ...post } : null
  },

  async create(postData) {
    await delay(400)
    const newPost = {
      id: Date.now(),
      username: 'You',
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      timestamp: new Date().toISOString(),
      ...postData
    }
    posts.unshift(newPost)
    return { ...newPost }
  },

  async update(id, updateData) {
    await delay(300)
    const index = posts.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Post not found')
    
    posts[index] = { ...posts[index], ...updateData }
    return { ...posts[index] }
  },

  async delete(id) {
    await delay(250)
    const index = posts.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Post not found')
    
    const deleted = posts.splice(index, 1)[0]
    return { ...deleted }
  }
}