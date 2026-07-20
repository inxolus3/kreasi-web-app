import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { authClient } from '../api/client';

const Consumer = () => { const auth = useAuth(); return <><span>{auth.user?.email ?? 'anonymous'}</span><button onClick={() => auth.login('admin@example.test', 'Password123!')}>login</button><button onClick={() => auth.logout()}>logout</button></>; };
const renderAuth = () => render(<MemoryRouter><AuthProvider><Consumer /></AuthProvider></MemoryRouter>);

describe('AuthContext', () => {
  it('restores a session and persists the token returned by login', async () => {
    vi.mocked(authClient.get).mockResolvedValueOnce({ data: { data: { id: 1, email: 'admin@example.test', name: 'Admin', role: 'ADMIN' } } } as any);
    vi.mocked(authClient.post).mockResolvedValueOnce({ data: { data: { accessToken: 'token', user: { id: 1, email: 'admin@example.test', name: 'Admin', role: 'ADMIN' } } } } as any);
    renderAuth(); await userEvent.click(await screen.findByRole('button', { name: 'login' }));
    await waitFor(() => expect(localStorage.getItem('accessToken')).toBe('token'));
  });
  it('clears saved auth state on logout', async () => {
    localStorage.setItem('accessToken', 'token'); vi.mocked(authClient.get).mockResolvedValueOnce({ data: { data: null } } as any); vi.mocked(authClient.post).mockResolvedValueOnce({ data: {} } as any);
    renderAuth(); await userEvent.click(await screen.findByRole('button', { name: 'logout' }));
    await waitFor(() => expect(localStorage.getItem('accessToken')).toBeNull());
  });
});
