import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sanitizeObject } from '@/lib/xss';
import { ZodSchema } from 'zod';

export type SecureHandlerContext<T> = {
  userId: string;
  data: T;
};

/**
 * CapitalS API Sentinel Wrapper
 * Hardens Next.js API endpoints against unauthorized access, injection, XSS, and payload abuses.
 */
export function secureRoute<T>(
  schema: ZodSchema<T> | null,
  handler: (req: Request, context: SecureHandlerContext<T>) => Promise<NextResponse>
) {
  return async function (req: Request): Promise<NextResponse> {
    try {
      // 1. Verify Payload Size (Limit to 2MB)
      const contentLength = Number(req.headers.get('content-length') || 0);
      if (contentLength > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'PAYLOAD_TOO_LARGE', message: 'Payload size exceeds 2MB limit.' },
          { status: 413 }
        );
      }

      // 2. Enforce Authentication
      const authHeader = req.headers.get('Authorization') || '';
      let userId: string | null = null;

      // Extract JWT from bearer token or fallback to session check
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (supabase) {
          const { data: { user }, error } = await supabase.auth.getUser(token);
          if (!error && user) {
            userId = user.id;
          }
        }
      }

      // If no token auth header, check cookies/session directly
      if (!userId && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          userId = session.user.id;
        }
      }

      // In development/preview mode, fallback to simulated user-id if running local mock
      if (!userId && process.env.NODE_ENV !== 'production') {
        userId = 'user-mock-123';
      }

      if (!userId) {
        return NextResponse.json(
          { error: 'UNAUTHORIZED', message: 'Valid authentication session required.' },
          { status: 401 }
        );
      }

      // 3. Extract and Validate Body Data
      let parsedData: T = {} as T;
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const body = await req.json();
        
        // Escape strings inside body payload recursively to prevent XSS
        const sanitizedBody = sanitizeObject(body);

        // Run strict Zod schema validation
        if (schema) {
          const validationResult = schema.safeParse(sanitizedBody);
          if (!validationResult.success) {
            return NextResponse.json(
              { 
                error: 'VALIDATION_FAILED', 
                message: 'Invalid request payload format.', 
                details: validationResult.error.flatten() 
              },
              { status: 400 }
            );
          }
          parsedData = validationResult.data;
        } else {
          parsedData = sanitizedBody;
        }
      }

      // 4. Invoke the Route Handler
      return await handler(req, { userId, data: parsedData });

    } catch (err: any) {
      console.error('API_HANDLER_ERROR:', err);

      // Redact stack traces in production to prevent technical footprint leaks
      const isProduction = process.env.NODE_ENV === 'production';
      return NextResponse.json(
        { 
          error: 'INTERNAL_SERVER_ERROR', 
          message: 'An unexpected server error occurred.',
          details: isProduction ? undefined : err.stack || err.message
        },
        { status: 500 }
      );
    }
  };
}
