let sequence = 0;
export const buildPost = (overrides: Record<string, unknown> = {}) => { sequence += 1; return { title: `Test post ${sequence}`, slug: `test-post-${sequence}`, content: '<p>Test content</p>', status: 'DRAFT', featured: false, ...overrides }; };
export const createPost = buildPost;
