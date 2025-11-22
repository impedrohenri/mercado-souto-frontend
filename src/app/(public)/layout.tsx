export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="h-screen bg-white min-w-full">
            {children}
        </div>
  );
}
