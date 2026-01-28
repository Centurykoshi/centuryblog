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
    const currentHostname = isClient ? window.location.hostname : 'N/A';
    const currentOrigin = isClient ? window.location.origin : 'N/A';

    console.log('═══════════════════════════════════════');
    console.log('🔍 getUrl() called');
    console.log('📍 Environment:', isClient ? 'CLIENT' : 'SERVER');
    console.log('🌐 Current hostname:', currentHostname);
    console.log('🌐 Current origin:', currentOrigin);
    console.log('⚙️  NEXT_PUBLIC_URL:', process.env.NEXT_PUBLIC_URL);

    const base = (() => {
        if (isClient) {
            console.log('✅ Using relative URL (empty string)');
            return ''; // Browser: use relative URL
        }
        console.log('🖥️ Server-side detected');
        const url = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        console.log('📤 Using SSR URL:', url);
        return url;
    })();

    const finalUrl = `${base}/api/trpc`;
    console.log('🎯 FINAL URL:', finalUrl);
    console.log('═══════════════════════════════════════');
    return finalUrl;
}
export function TRPCReactProvider(
    props: Readonly<{
        children: React.ReactNode;
    }>,
) {
    console.log('🚀 TRPCReactProvider initializing...');
    console.log('🌍 Window exists?', typeof window !== 'undefined');
    console.log('🌍 Window origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A');

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
                    // transformer: superjson, <-- if you use a data transformer
                    url: getUrl(),
                    fetch: (url, options) => {
                        console.log('📡 tRPC Fetch intercepted!');
                        console.log('📍 Fetching URL:', url);
                        console.log('📍 Full URL (resolved):', new URL(url as string, window.location.origin).href);
                        return fetch(url, options);
                    }
                }),
            ],
        });
        console.log('✅ tRPC client created');
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