import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
    return (
        <html lang="uk" className={inter.variable}>
            <body>
                <SmoothScroll>
                    {children}
                </SmoothScroll>
            </body>
        </html>
    );
}