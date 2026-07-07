import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'br', 'span', 'div', 'img', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'style']
  }) as string;
}

// Recursively sanitize all string properties of an object or array to protect outputs
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    // Only sanitize if it looks like HTML to preserve plain strings/JSON/UUIDs/URLs
    if (obj.includes('<') || obj.includes('>') || obj.includes('&')) {
      return sanitizeHtml(obj) as unknown as T;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    // Avoid sanitizing database models' internal objects/dates
    if (obj instanceof Date || obj instanceof RegExp) {
      return obj;
    }
    const sanitized: any = {};
    for (const key of Object.keys(obj)) {
      sanitized[key] = sanitizeObject((obj as any)[key]);
    }
    return sanitized as T;
  }
  
  return obj;
}
