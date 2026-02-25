'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

export function GTMPageTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            let url = pathname;
            if (searchParams && searchParams.toString()) {
                url += `?${searchParams.toString()}`;
            }

            // Push the virtual page view to the GTM dataLayer
            sendGTMEvent({
                event: 'page_view',
                page_path: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}
