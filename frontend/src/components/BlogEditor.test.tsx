import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BlogEditor } from './BlogEditor';
import { apiV1Client } from '../api/client';

describe('BlogEditor', () => {
  it('renders an editable rich-text surface and invokes image upload', async () => {
    vi.mocked(apiV1Client.post).mockResolvedValueOnce({ data: { data: { url: '/uploads/test.webp' } } } as any);
    render(<BlogEditor value="<p>Hello</p>" onChange={vi.fn()} />);
    expect(document.querySelector('[contenteditable="true"]')).toHaveTextContent('Hello');
    const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(imageInput, { target: { files: [new File(['image'], 'test.png', { type: 'image/png' })] } });
    expect(await vi.waitFor(() => apiV1Client.post)).toHaveBeenCalled();
  });
});
