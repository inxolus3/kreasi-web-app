import { http, HttpResponse } from 'msw';
import { mockPost, mockSettings, mockUser } from './data';
export const handlers = [
  http.get('*/api/auth/me', () => HttpResponse.json({ status: 'success', data: mockUser })),
  http.post('*/api/auth/login', () => HttpResponse.json({ status: 'success', data: { accessToken: 'test-token', user: mockUser } })),
  http.get('*/api/blog/posts', () => HttpResponse.json({ status: 'success', data: [mockPost], meta: { page: 1, limit: 10, total: 1, totalPages: 1 } })),
  http.get('*/api/v1/public/settings', () => HttpResponse.json({ status: 'success', data: mockSettings })),
  http.get('*/api/v1/users', () => HttpResponse.json({ status: 'success', data: [mockUser] })),
];
