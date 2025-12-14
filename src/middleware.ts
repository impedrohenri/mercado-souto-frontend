import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { is } from "zod/v4/locales";

const whenNotAuthenticated = '/login';

const publicRoutes = [
    {path: '/login', whenAuthenticated: 'redirect'},
    {path: '/cadastro', whenAuthenticated: 'redirect'},
    {path: '/recuperar-senha', whenAuthenticated: 'redirect'},
    {path: '/', whenAuthenticated: ''},
    {path: '/produto/:id', whenAuthenticated: ''},

]

const sellerRoutes = [
    {path: '/anuncie', whenNotSeller: 'redirect'},
    {path: '/anuncios', whenNotSeller: 'redirect'},
    {path: '/vendas', whenNotSeller: 'redirect'},
]

function matchRoute(routePath: string, currentPath: string) {
    if (routePath.includes(':')) {
        const regex = new RegExp(
            "^" +
            routePath.replace(/:[^\/]+/g, "[^/]+") +
            "$"
        );
        return regex.test(currentPath);
    }

    return routePath === currentPath;
}

export default async function middleware(request: NextRequest){
    const path = request.nextUrl.pathname;

    const isPublicRoute = publicRoutes.find(r =>
        matchRoute(r.path, path)
    );

    
    const token = (await cookies()).get('user@token')
    const role = (await cookies()).get('user@roles')?.value.includes('ROLE_SELLER') ? 'ROLE_SELLER' : 'ROLE_CLIENT';

    if (!!token && isPublicRoute?.whenAuthenticated === 'redirect'){
        return NextResponse.redirect(request.nextUrl.origin);
        
    } else if (!token && !isPublicRoute){
        return NextResponse.redirect(request.nextUrl.origin + whenNotAuthenticated )

    }

    
    const isSellerRoute = sellerRoutes.find(r =>
        matchRoute(r.path, path)
    );

    if (isSellerRoute && role !== 'ROLE_SELLER') {
        return NextResponse.redirect(new URL('/cadastro-de-vendedor', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\..+$).*)",
    ],
};

