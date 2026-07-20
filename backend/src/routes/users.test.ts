import { describe, it, expect } from 'vitest'
import { request } from '../tests/helpers/request.helper'
import { createUser } from '../tests/factories/user.factory'

describe('Users API', () => {
  it('GET users requires auth', async () => {
    const res = await request().get('/api/v1/users')
    expect(res.status).toBeOneOf([401, 403])
  })
})
