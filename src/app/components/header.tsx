import {
  Sparkles,
  Workflow,
  CreditCard,
  Info,
  LogIn,
  MessageSquareText,
  Bot,
} from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client";
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
  return (
    <header className="flex md:flex-row flex-col md:justify-between md:items-center">
      <div className="logo flex items-center gap-1 text-logo-color font-mono  ">
        <span>
          <Bot className="text-xl font-bold" />
        </span>
        <span className="text-xl font-bold">AskIt</span>
      </div>

    <nav className="md:flex hidden gap-10 items-center ">
    {mobileNavbarIcon
      .filter(item => item.name !== "Login" && item.name !== "Interview")
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
      .filter(item => item.name === "Login" || item.name === "Interview")
      .map((item, index) => (
        <Link href={item.href} key={index}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="bg-foreground w-40 rounded text-black py-2 text-md font-medium text-center cursor-pointer"
          >
            {item.name}
          </motion.button>
        </Link>
      ))}
  </div>

      <div className="mobile md:hidden flex gap-10 justify-center items-center bg-foreground mt-5 text-background rounded p-2 w-full">
        {mobileNavbarIcon.map((navbar, index) => {
          const Icon = navbar.icon;
          return (
            <Link href="#" key={index}>
              <Icon />
            </Link>
          );
        })}
      </div>
    </header>
  );
}
// [Login] [Start Interview 🚀]
