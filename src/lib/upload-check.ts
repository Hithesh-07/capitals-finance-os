/**
 * CapitalS File Upload Sentinel
 * Secures receipt and UPI screenshot uploads against payload injections and executables.
 */

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadCheckResult {
  isValid: boolean;
  error?: string;
  sanitizedName?: string;
}

export function validateUploadFile(file: File): UploadCheckResult {
  // 1. Check size
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'FILE_TOO_LARGE: Maximum size allowed is 5MB.' };
  }

  // 2. Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { isValid: false, error: 'INVALID_FILE_TYPE: Only JPEG, PNG, and WEBP images are permitted.' };
  }

  // 3. Check file extension
  const dotIndex = file.name.lastIndexOf('.');
  if (dotIndex === -1) {
    return { isValid: false, error: 'MISSING_FILE_EXTENSION: Files must have a valid extension.' };
  }

  const extension = file.name.substring(dotIndex + 1).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: `FORBIDDEN_FILE_EXTENSION: Extension .${extension} is blocked.` };
  }

  // 4. Sanitize Filename (Replace non-alphanumeric chars, prevent path traversal)
  const baseName = file.name.substring(0, dotIndex);
  const cleanBase = baseName
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace special characters with underscore
    .substring(0, 50); // Limit name length

  const sanitizedName = `${cleanBase}_${Date.now()}.${extension}`;

  return {
    isValid: true,
    sanitizedName
  };
}
