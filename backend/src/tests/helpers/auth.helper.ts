import request from 'supertest';
import app from '../../app';

// Login and return access token extracted from the Set-Cookie header
export const loginAs = async (email: string, password: string) => {
	const resp = await request(app).post('/api/auth/login').send({ email, password });
	const setCookie = resp.headers['set-cookie'] as string[] | undefined;
	if (!setCookie) return '';
	const accessCookie = setCookie.find(c => c.startsWith('accessToken='));
	if (!accessCookie) return '';
	const match = accessCookie.match(/accessToken=([^;]+)/);
	return match ? match[1] : '';
};

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
