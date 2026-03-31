import type { Metadata } from "next";
import { Red_Rose } from "next/font/google";
import Header from "./components/header";
import "./globals.css";

const redRose = Red_Rose({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AskIt",
  description: "AskIt is an AI powered project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={` h-full ${redRose.className} antialiased`}>
      <body
        className="min-h-full flex flex-col  w-full h-screen bg-no-repeat bg-cover "
        style={{ backgroundImage: "url(/images/background.jpg)" }}
      >
        <Header />

        <div className="">{children}</div>
      </body>
    </html>
  );
}
