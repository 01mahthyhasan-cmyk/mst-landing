import { NextResponse } from 'next/server';
import { verifyPreviewToken } from '@/lib/auth';

export async function GET(request, { params }) {
  const { lang } = await params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'No preview token provided' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Verify JWT
  const { valid, payload, error } = await verifyPreviewToken(token);
  if (!valid) {
    return new NextResponse(
      JSON.stringify({ error: `Invalid preview token: ${error}` }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { slug } = payload;

  // Map slug to public path
  const slugToPath = {
    'home': '/',
    'about': '/about',
    'services': '/services',
    'blog': '/blog',
    'case-study': '/case-study',
    'team': '/team',
    'testimonials': '/testimonials',
    'image-gallery': '/image-gallery',
    'video-gallery': '/video-gallery',
    'pricing': '/pricing',
    'faqs': '/faqs',
    'contact': '/contact',
    'book-appointment': '/book-appointment',
    '404': '/404'
  };

  const pathSuffix = slugToPath[slug] || '/';
  const redirectPath = lang === 'en' ? `/en${pathSuffix}` : pathSuffix;

  // Create redirect response
  const response = NextResponse.redirect(new URL(redirectPath, request.url));

  // Set preview cookie on response headers
  response.cookies.set('mst_preview_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 300 // 5 minutes
  });

  return response;
}
