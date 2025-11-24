export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="h-screen min-w-full max-w-full">
            {children}
        </div>
  );
}
