import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UsersPage } from './UsersPage';
import { apiV1Client } from '../../api/client';

describe('UsersPage', () => {
  it('renders an empty state and opens the create-user form', async () => {
    vi.mocked(apiV1Client.get).mockResolvedValueOnce({ data: { data: [] } } as any);
    render(<UsersPage />);
    expect(await screen.findByText('Tidak ada pengguna terdaftar.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /add user account/i }));
    expect(screen.getByText('Add New User')).toBeInTheDocument();
  });
  it('filters the displayed users', async () => {
    vi.mocked(apiV1Client.get).mockResolvedValueOnce({ data: { data: [{ id: 2, name: 'Jane', email: 'jane@example.test', role: 'editor' }] } } as any);
    render(<UsersPage />); await screen.findByText('Jane');
    await userEvent.type(screen.getByPlaceholderText(/cari nama/i), 'nobody');
    await waitFor(() => expect(screen.queryByText('Jane')).not.toBeInTheDocument());
  });
});
