import { describe, expect, it } from 'vitest';
import { apiV1Client, authClient } from './client';
describe('API clients', () => {
  it('uses the configured v1 base URL', () => expect(apiV1Client.defaults.baseURL).toContain('/api/v1'));
  it('adds an Authorization header from localStorage', async () => { localStorage.setItem('accessToken', 'abc'); const handler = (apiV1Client.interceptors.request as any).handlers[0].fulfilled; await expect(handler({ headers: {} })).resolves.toMatchObject({ headers: { Authorization: 'Bearer abc' } }); });
  it('keeps auth endpoints on the auth base URL', () => expect(authClient.defaults.baseURL).toContain('/api/auth'));
});
