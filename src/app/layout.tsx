import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import constants from "@/constants";

import YandexMetrika from "@/components/yandex";

import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Location App",
  description: "Basic location app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
         { /*
   <html lang="en">
     <Head>
       <YandexMetrika
         yid={constants.YANDEX_ID}
         clickmap={true}
         trackLinks={true}
         accurateTrackBounce={true}
         webvisor={true}
       />
     </Head>
     <body className={inter.className}>{children}</body>
     <GoogleAnalytics gaId={constants.GA} />
   </html>*/}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
