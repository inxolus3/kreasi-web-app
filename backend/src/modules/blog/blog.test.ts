import { describe, it, expect } from 'vitest'
import { request } from '../../tests/helpers/request.helper'
import { createPost } from '../../tests/factories/post.factory'

describe('Blog API', () => {
  it('lists posts and pagination meta', async () => {
    const res = await request().get('/api/blog/posts').query({ page: 1, limit: 10 })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('meta')
  })

  it('get not found for unknown id', async () => {
    const res = await request().get('/api/blog/posts/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBeOneOf([404, 400])
  })
})
