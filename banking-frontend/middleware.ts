import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    // Redirect to login if accessing protected route without token
    if (!isPublicRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if accessing auth pages with token
    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
