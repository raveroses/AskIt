import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
export default function HeroSection() {
  const buttons = [
    {
      href: "#",
      name: "Start Mock Interview",
    },
    {
      href: "#",
      name: "Try CV Review",
    },
  ];
  return (
    <section className="flex md:flex-row flex-col justify-between items-center md:gap-0 gap-10 my-20 w-full">
      <div className="md:w-[45%] w-full flex flex-col gap-10 md:pr-0 pr-5">
        <h1 className="md:text-6xl text-4xl font-bold">
          Practice <span className="text-logo-color"> Interviews</span> with AI
          & Get Instant Feedback
        </h1>
        <h3 className="text-xl font-semibold">
          Boost your confidence, improve your answers, and land your dream job.
        </h3>

        <div className="flex items-center md:gap-10 gap-5">
          {buttons.map((button, index) => {
            return (
              <Link href={button.href} key={index}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="bg-logo-color text-background md:w-50 w-40 rounded py-2 md:text-md text-sm font-medium text-center cursor-pointer"
                >
                  {button.name}
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="relative md:h-180 md:w-1/2 w-full h-80">
        <Image
          alt="ai-image"
          src="/images/ai.jpg"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top rounded-xl"
          priority
        />
      </div>
    </section>
  );
}
