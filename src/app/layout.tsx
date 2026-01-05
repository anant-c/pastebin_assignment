import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Text Share - Secure Text Sharing',
  description: 'Share text securely with expiration options',
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