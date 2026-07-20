import request from 'supertest';
import app from '../../app';
export const loginAs = async (email: string, password: string) => (await request(app).post('/api/auth/login').send({ email, password })).body.data?.accessToken as string;
export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
