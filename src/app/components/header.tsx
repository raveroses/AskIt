"use client";
import {
  Sparkles,
  Workflow,
  CreditCard,
  Info,
  LogIn,
  MessageSquareText,
  Bot,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const mobileNavbarIcon = [
    {
      href: "#",
      name: "Features",
      icon: Sparkles,
    },
    {
      href: "#",
      name: "How it works",
      icon: Workflow,
    },
    {
      href: "#",
      name: "Pricing",
      icon: CreditCard,
    },
    {
      href: "#",
      name: "About",
      icon: Info,
    },
    {
      href: "#",
      name: "Login",
      icon: LogIn,
    },
    {
      href: "#",
      name: "Interview",
      icon: MessageSquareText,
    },
  ];

  const [navOpen, setNavOpen] = useState<boolean>(false);

  const handleNavOpen = () => {
    setNavOpen(prev => !prev);
  };


  const pathname = usePathname();
  const isInterview = pathname && pathname === "/interview"
  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-30 md:py-10 ${isInterview ? "md:px-10" : ""}`}>
      <div className="flex flex-row md:justify-between justify-between md:items-center">
        <div className="logo flex items-center gap-1  font-mono  ">
          <span className="text-logo-color">
            <Bot className="text-xl font-bold" />
          </span>
          <span className="text-xl font-bold text-background">AskIt</span>
        </div>

        <nav className="md:flex hidden gap-10 items-center ">
          {mobileNavbarIcon
            .filter(
              (item) => item.name !== "Login" && item.name !== "Interview",
            )
            .map((item, index) => (
              <motion.a
                key={index}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, color: "var(--logo-color)" }}
                transition={{ duration: 0.5 }}
                href={item.href}
              >
                {item.name}
              </motion.a>
            ))}
        </nav>

        <div className="md:flex hidden items-center gap-4">
          {mobileNavbarIcon
            .filter(
              (item) => item.name === "Login" || item.name === "Interview",
            )
            .map((item, index) => (
              <Link href={item.href} key={index}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="bg-background w-40 rounded text-foreground py-2 text-md font-medium text-center cursor-pointer"
                >
                  {item.name}
                </motion.button>
              </Link>
            ))}
        </div>

        <div className="md:hidden block" onClick={handleNavOpen}>
          {navOpen ? (
            <X className="text-xl font-bold" />
          ) : (
            <Menu className="text-xl font-semibold" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            className="mobile md:hidden flex gap-2 justify-between items-center bg-logo-color mt-5 text-background  py-2 w-full overflow-x-scroll absolute top-10 right-0 z-30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {mobileNavbarIcon.map((navbar, index) => {
              const Icon = navbar.icon;
              return (
                <motion.a
                  key={index}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, color: "var(--logo-color)" }}
                  whileTap={{ scale: 0.8, color: "var(--logo-color)" }}
                  transition={{ duration: 0.5 }}
                  href="#"
                  className="flex flex-col gap-2 items-center shrink-0 w-20"
                >
                  <Icon />
                  <span className="inline-block text-xs">{navbar.name}</span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
