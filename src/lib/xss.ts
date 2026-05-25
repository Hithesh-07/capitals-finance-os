/**
 * CapitalS XSS Guard
 * Encodes and sanitizes all user input strings to prevent Cross-Site Scripting (XSS) and injection vectors.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;'
};

export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return '';
  
  // Escape HTML characters
  return val.replace(/[&<>"'`/]/g, char => HTML_ESCAPE_MAP[char]);
}

export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as any;
  }

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (typeof val === 'string') {
        result[key] = sanitizeString(val);
      } else if (typeof val === 'object' && val !== null) {
        result[key] = sanitizeObject(val);
      } else {
        result[key] = val;
      }
    }
  }
  return result as T;
}
