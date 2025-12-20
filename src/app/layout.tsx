import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "../components/providers/SmoothScroll"; // Імпорт компонента
import "./globals.scss";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "KOLO - Розважальний комплекс",
    description: "Найкраще місце для відпочинку, святкувань та розваг.",
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