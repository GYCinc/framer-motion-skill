import './globals.css';

export const metadata = {
  title: 'Framer Motion - Ultimate Showcase (183 Examples)',
  description: 'Interactive showcase of Framer Motion animations and components',
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
