import { describe, expect, it, vi } from 'vitest';
import { errorHandler } from './errorHandler';

describe('errorHandler', () => {
  it('returns a 503 response when the database is unavailable', () => {
    const req = {
      method: 'GET',
      originalUrl: '/api/blog/posts',
    } as any;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;

    const next = vi.fn();

    errorHandler(
      { code: 'P1001', message: "Can't reach database server" },
      req,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Database temporarily unavailable. Please try again later.',
    });
  });
});
