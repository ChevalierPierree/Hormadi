import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import {
  authenticateRequest,
  jsonResponse,
  errorResponse,
  logAdminAction,
} from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request, ['super_admin', 'editor']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get('logo') as File | null;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // Validate file is actually a file
    if (!(file instanceof File)) {
      return errorResponse('Invalid file', 400);
    }

    // Convert filename to slug (remove spaces, special chars, lowercase)
    const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const ext = file.name.split('.').pop() || 'png';
    const slugified = originalName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFilename = `${slugified}-${timestamp}.${ext}`;

    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', 'images', 'partners');
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const filePath = join(uploadDir, uniqueFilename);
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    // Build public URL path
    const publicUrl = `/images/partners/${uniqueFilename}`;

    // Log admin action
    await logAdminAction(
      authResult.id,
      'UPLOAD_PARTNER_LOGO',
      'partner_upload',
      undefined,
      `Uploaded logo: ${uniqueFilename}`
    );

    return jsonResponse(
      { url: publicUrl, filename: uniqueFilename },
      200
    );
  } catch (error) {
    console.error('Upload partner logo error:', error);
    return errorResponse('Internal server error', 500);
  }
}
