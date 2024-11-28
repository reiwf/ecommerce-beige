
import "../globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Header from "@/components/Header";
import {SanityLive} from "@/sanity/lib/live";



export default function Layout1({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider dynamic>
      <main className="font-work-sans">
        <Header/>
        {children}
      </main>
      </ClerkProvider>
  );
}
