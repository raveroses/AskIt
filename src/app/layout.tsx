import type { Metadata } from "next";
import { Red_Rose, Geist } from "next/font/google";
import Header from "./components/header";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { QueryClientProvider } from "@tanstack/react-query";
// import {queryClient} from "@/app/components/newQueryClient"
const redRose = Red_Rose({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AskIt",
  description: "AskIt is an AI powered project",
  icons: {
    icon: "/images/ai-human.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", redRose.className, "font-sans", geist.variable)}>
      <body
        className="min-h-screen flex flex-col w-full h-screen bg-no-repeat bg-fixed bg-cover "
        style={{ backgroundImage: "url(/images/background.jpg)" }}
      >
        <Header />

        {/* <QueryClientProvider client={queryClient}> */}
        {children}

        {/* <ReactQueryDevtools initialIsOpen={true} buttonPosition={"bottom-left"}/>
        </QueryClientProvider> */}
      </body>
    </html>
  );
}
