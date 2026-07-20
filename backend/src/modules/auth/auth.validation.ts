import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

// The refresh-token endpoint accepts a refresh token via the HttpOnly
// cookie OR via the JSON body. The Zod schema below tolerates an empty
// body so a cookie-only request still passes validation; the controller
// is responsible for ensuring at least one of the two channels supplies
// a valid refresh token.
export const refreshTokenSchema = z.object({
  body: z
    .union([
      z.object({
        refreshToken: z.string().min(1),
      }),
      z.object({}).strict(),
    ])
    .optional(),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: z.string().min(6),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
});