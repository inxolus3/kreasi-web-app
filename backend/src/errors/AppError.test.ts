import { describe, expect, it } from 'vitest';
import { AppError } from './AppError';

describe('AppError', () => {
  it('stores statusCode and operational flag', () => {
    const error = new AppError('Duplicate billboard', 409);

    expect(error.message).toBe('Duplicate billboard');
    expect(error.statusCode).toBe(409);
    expect(error.isOperational).toBe(true);
  });
});
