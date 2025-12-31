import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SmoothScroll } from "../components/providers/SmoothScroll";
import "./globals.scss";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "KOLO - Розважальний комплекс",
    description: "Найкраще місце для відпочинку, святкувань та розваг.",
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#020b26",
    interactiveWidget: "resizes-content",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Використовуємо змінну середовища або фолбек (про всяк випадок)
    const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XN63SY65Z6';

    return (
        <html lang="uk" className={inter.variable}>
            <head>
                <Script id="fb-pixel" strategy="afterInteractive">
                    {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '1972061640213690');
                        fbq('track', 'PageView');
                    `}
                </Script>
                <noscript>
                    <img 
                        height="1" 
                        width="1" 
                        style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=1972061640213690&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
            </head>
            <body>
                <SmoothScroll>
                    {children}
                </SmoothScroll>
                {/* 👇 Тепер тут змінна, яку ми задали у Vercel */}
                <GoogleAnalytics gaId={gaId} />
            </body>
        </html>
    );
}