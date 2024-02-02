import { UserButton } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <nav className="w-full p-4 pr-4 flex justify-end">
        <UserButton afterSignOutUrl="/" />
    </nav>
    {children}
    </>
  );
}
