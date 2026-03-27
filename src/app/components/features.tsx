"use client";
import { Target, MessageSquareText, BarChart3 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
const MotionImage = motion(Image);
export default function Features() {
  const howItWorksContent = [
    {
      icon: Target, // 🎯 clear goal / selection
      heading: "Choose Your Role",
      paragraphContent:
        "Pick your desired role and experience level to receive personalized interview questions tailored to your career path.",
      images: "/images/ai.jpg",
    },
    {
      icon: MessageSquareText, // 💬 interview/chat
      heading: "Answer AI Questions",
      paragraphContent:
        "Respond to AI-generated questions designed to simulate real interview scenarios and test your knowledge.",
      images: "/images/unsplash.jpg",
    },
    {
      icon: BarChart3, // 📊 analytics/feedback
      heading: "Get Instant Feedback",
      paragraphContent:
        "Get instant insights on your performance with clear scoring, improvement tips, and confidence-building guidance",
      images: "/images/phone.jpg",
    },
  ];

  const [numberHowItWorksClick, setNumberHowItWorksClick] = useState<number>(0);
  const handleNumberHowItWorksClick = (id: number) => {
    setNumberHowItWorksClick(id);
  };

  return (
    <section className="w-full my-40">
      <div className="text-center pb-20">
        <h1 className=" text-2xl font-bold">
          How <span className="text-logo-color ">Askit</span> works
        </h1>
        <p className="text-md font-semibold pt-5">
          Click on each step to preview how it works.
        </p>
      </div>
      <div className=" flex md:flex-row flex-col md:gap-40 px-20">
        <div className="underneathImage relative  md:block hidden">
          <Image
            width={700}
            height={500}
            src="/images/desktop.jpg"
            alt="howitworks"
            className="rounded-xl object-center object-cover"
            priority
          />

          <MotionImage
            src={`${howItWorksContent[numberHowItWorksClick].images}`}
            alt={`${howItWorksContent[numberHowItWorksClick].heading}-image`}
            width={400}
            height={50}
            className="absolute top-11 left-41 object-cover object-top h-[223px] w-[362.8px] rotate-3 rounded-tl"
            priority
          />
        </div>
        <div className=" md:hidden block ">
          <Image
            src={`${howItWorksContent[numberHowItWorksClick].images}`}
            alt={`${howItWorksContent[numberHowItWorksClick].heading}-image`}
            width={300}
            height={300}
            className="w-full h-[600px] min-w-full  object-cover rounded-2xl"
            priority
          />
        </div>

        <div className="aboveImage md:w-[40%] w-full flex flex-col gap-10">
          {howItWorksContent.map((each, index) => {
            const Icon = each.icon;
            return (
              <motion.div
                key={index}
                className={`${
                  numberHowItWorksClick === index &&
                  "border-l-3 border-amber-500"
                } pl-5 flex gap-5 items-center cursor-pointer py-5`}
                onClick={() => handleNumberHowItWorksClick(index)}
                initial={{
                  backgroundColor: "rgba(0,0,0,0)",
                }}
                whileHover={{
                  backgroundColor: "rgba(128,128,128,0.2)",
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-logo-color rounded p-3 ">
                  {<Icon className="text-black" />}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-logo-color">
                    {each.heading}
                  </h1>
                  <p>{each.paragraphContent}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
