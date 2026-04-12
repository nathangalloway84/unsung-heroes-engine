import "./globals.css";
import React from "react";

export const metadata = {
  title: "Unsung Heroes Engine",
  description: "Paralympic Performance Analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@300;500;700;900&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="overflow-hidden bg-[#0b1326] text-[#dae2fd]">
        {children}
      </body>
    </html>
  );
}
