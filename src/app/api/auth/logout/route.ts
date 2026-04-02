import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';
import { jsonResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = jsonResponse({ message: 'Logged out successfully' }, 200);

    // Clear session cookie
    clearSessionCookie();

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
