/**
 * CapitalS Environment Security Sentinel
 * Ensures environment variables are securely handled and validated on startup.
 */

const REQUIRED_SERVER_VARS = [
  'DATABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXTAUTH_SECRET'
];

const REQUIRED_PUBLIC_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

export function validateEnvironment() {
  const missingServer = REQUIRED_SERVER_VARS.filter(v => !process.env[v]);
  const missingPublic = REQUIRED_PUBLIC_VARS.filter(v => !process.env[v]);

  // Fail-safe check: Ensure server-side secrets are NEVER exposed with NEXT_PUBLIC_ prefix
  const leakedSecrets = Object.keys(process.env).filter(key => 
    key.startsWith('NEXT_PUBLIC_') && 
    (key.includes('ROLE') || key.includes('SECRET') || key.includes('PASSWORD') || key.includes('DATABASE_URL'))
  );

  if (leakedSecrets.length > 0) {
    throw new Error(
      `CRITICAL SECURITY VIOLATION: Server secrets leaked client-side via NEXT_PUBLIC prefix: ${leakedSecrets.join(', ')}`
    );
  }

  if (missingPublic.length > 0) {
    console.warn(
      `[Warning] Missing public environment parameters: ${missingPublic.join(', ')}. System will fallback to local preview mode.`
    );
    return false;
  }

  if (missingServer.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(
      `CRITICAL INCOMPLETE DEPLOYMENT: Required production variables are missing: ${missingServer.join(', ')}`
    );
  }

  return true;
}
