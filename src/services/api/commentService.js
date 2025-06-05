import commentsData from '../mockData/comments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let comments = [...commentsData]

export const commentService = {
  async getAll() {
    await delay(250)
    return [...comments].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  },

  async getById(id) {
    await delay(200)
    const comment = comments.find(c => c.id === id)
    return comment ? { ...comment } : null
  },

  async getByPostId(postId) {
    await delay(200)
    return [...comments]
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  },

  async create(commentData) {
    await delay(350)
    const newComment = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...commentData
    }
    comments.push(newComment)
    return { ...newComment }
  },

  async update(id, updateData) {
    await delay(300)
    const index = comments.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Comment not found')
    
    comments[index] = { ...comments[index], ...updateData }
    return { ...comments[index] }
  },

  async delete(id) {
    await delay(250)
    const index = comments.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Comment not found')
    
    const deleted = comments.splice(index, 1)[0]
    return { ...deleted }
  }
}