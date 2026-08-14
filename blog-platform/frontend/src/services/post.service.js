import api from './api'

class PostService {
  async getPosts(section = '') {
    const params = section ? { section } : {}
    // api خودش withCredentials داره
    const response = await api.get('/posts', { params })
    return response.data
  }

  async getPost(id) {
    const response = await api.get(`/posts/${id}`)
    return response.data
  }

  async createPost(postData) {
    const formData = new FormData()
    formData.append('title', postData.title)
    formData.append('content', postData.content)
    formData.append('section', postData.section)
    formData.append('published', postData.published)
    
    if (postData.image) {
      formData.append('image', postData.image)
    }

    const response = await api.post('/admin/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  async updatePost(id, postData) {
    const formData = new FormData()
    formData.append('title', postData.title)
    formData.append('content', postData.content)
    formData.append('section', postData.section)
    formData.append('published', postData.published)
    
    if (postData.image) {
      formData.append('image', postData.image)
    }

    const response = await api.put(`/admin/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  async togglePublish(id) {
    const response = await api.patch(`/admin/posts/${id}/toggle`)
    return response.data
  }

  async deletePost(id) {
    const response = await api.delete(`/admin/posts/${id}`)
    return response.data
  }

  async getAllPosts() {
    const response = await api.get('/admin/posts/all')
    return response.data
  }

  async getSections() {
    const response = await api.get('/sections')
    return response.data
  }
}

export default new PostService()
