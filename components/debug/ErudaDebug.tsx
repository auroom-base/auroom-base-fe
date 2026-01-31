'use client';

import { useEffect } from 'react';

export function ErudaDebug() {
    useEffect(() => {
        // Only load if configured or in dev/preview
        // For this debugging session, we load it unconditionally on client
        if (typeof window !== 'undefined') {
            const loadEruda = async () => {
                try {
                    // dynamic import to avoid server-side issues
                    // @ts-ignore
                    const eruda = (await import('eruda')).default;
                    eruda.init();
                    console.log("Eruda Initialized");
                } catch (e) {
                    console.error("Failed to load Eruda", e);
                }
            };
            loadEruda();
        }
    }, []);

    return null;
}
