export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="h-screen bg-white">
            {children}
        </div>
  );
}
