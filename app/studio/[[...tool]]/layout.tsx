import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Next.js",
    description: "Generated  next app",
};

export default function RootLayout({
                                           children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
            <html lang="en">
            <body>{children}</body>
            </html>
    );
}