'use client';
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    }
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}
function getUrl() {
    const isClient = typeof window !== 'undefined';
    console.log('🔧 getUrl() called - Environment:', isClient ? 'CLIENT' : 'SERVER');
    
    const base = (() => {
        if (isClient) {
            console.log('✅ Client-side: Using relative URL (empty string)');
            console.log('📍 Current window.location.origin:', window.location.origin);
            return ''; // Browser: use relative URL
        }
        console.log('🖥️ Server-side rendering');
        console.log('⚙️ VERCEL_URL:', process.env.VERCEL_URL);
        if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel SSR
        return 'http://localhost:3000'; // Local development SSR
    })();
    
    const finalUrl = `${base}/api/trpc`;
    console.log('🎯 Final tRPC URL:', finalUrl);
    return finalUrl;
}
export function TRPCReactProvider(
    props: Readonly<{
        children: React.ReactNode;
    }>,
) {
    console.log('🚀 TRPCReactProvider initializing...');
    
    // NOTE: Avoid useState when initializing the query client if you don't
    //       have a suspense boundary between this and the code that may
    //       suspend because React will throw away the client on the initial
    //       render if it suspends and there is no boundary
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() => {
        console.log('⚡ Creating tRPC client...');
        const client = createTRPCClient<AppRouter>({
            links: [
                httpBatchLink({
                    url: getUrl(),
                    fetch: (url, options) => {
                        console.log('═══════════════════════════════════');
                        console.log('📡 tRPC FETCH INTERCEPTED!');
                        console.log('📍 URL:', url);
                        console.log('📍 Method:', options?.method || 'GET');
                        console.log('📍 Headers:', options?.headers);
                        console.log('📍 Body preview:', options?.body ? String(options.body).substring(0, 200) : 'none');
                        console.log('═══════════════════════════════════');
                        return fetch(url, options).then(async res => {
                            console.log('📥 Response status:', res.status, res.statusText);
                            const clonedRes = res.clone();
                            try {
                                const data = await clonedRes.json();
                                console.log('📦 Response data:', JSON.stringify(data, null, 2));
                            } catch (e) {
                                console.log('⚠️ Could not parse response as JSON');
                            }
                            return res;
                        }).catch(err => {
                            console.error('❌ Fetch error:', err);
                            throw err;
                        });
                    }
                }),
            ],
        });
        console.log('✅ tRPC client created successfully');
        return client;
    });
    return (
        <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                {props.children}
            </TRPCProvider>
        </QueryClientProvider>
    );
}