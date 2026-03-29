"use client";
import {
  Target,
  MessageSquareText,
  BarChart3,
  BrainCircuit,
  MessageSquareCode,
  FileSearch,
  Sparkles,
  Bot,
} from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import useIsMobile from "../../../hooks/useIsMobile";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Link from "next/link";
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

  const features = [
    {
      icon: BrainCircuit,
      heading: "Mock Interviews",
      secondHeading:
        "Practice with realistic AI-generated interview questions tailored to your role",
      thirdHeading:
        "Get role-specific questions for tech, finance, marketing and more",
    },
    {
      icon: MessageSquareCode,
      heading: "Smart Feedback",
      secondHeading:
        "Instantly score your answers and see exactly where you went wrong",
      thirdHeading:
        "Pinpoint your weak areas and get actionable tips to improve them",
    },
    {
      icon: FileSearch,
      heading: "CV Improvement",
      secondHeading:
        "Upload your CV and get an instant AI-powered analysis in seconds",
      thirdHeading:
        "Receive targeted suggestions to make your CV stand out to recruiters",
    },
    {
      icon: Sparkles,
      heading: "Confidence Coaching",
      secondHeading:
        "Learn how to communicate your thoughts clearly and professionally",
      thirdHeading:
        "Build confidence over time and walk into any interview anxiety-free",
    },
  ];

  const testimonials = [
    {
      name: "Chidi Okonkwo",
      role: "Software Engineer at Flutterwave",
      image: "/images/ai.jpg",
      testimony:
        "AskIt completely transformed how I prepared for technical interviews. The role-based questions were spot on and the feedback helped me identify gaps I never knew I had. Landed my dream job in 3 weeks.",
    },
    {
      name: "Amara Nwosu",
      role: "Product Manager at Paystack",
      image: "/images/ai-human.jpg",
      testimony:
        "I was terrified of interviews until I found AskIt. The confidence coaching section alone is worth it. I went from freezing up to answering questions clearly and confidently. Got an offer on my second try.",
    },
    {
      name: "James Oladele",
      role: "Data Analyst at Access Bank",
      image: "/images/desktop.jpg",
      testimony:
        "The CV improvement feature is insane. I uploaded my CV and within seconds I had a full breakdown of what to fix. Recruiters started responding way more after I applied the suggestions.",
    },
    {
      name: "Fatima Aliyu",
      role: "UX Designer at Andela",
      image: "/images/phone.jpg",
      testimony:
        "What I love most is how realistic the mock interviews feel. It actually simulates the pressure of a real interview. By the time I sat for my actual interview I felt like I had done it a hundred times already.",
    },
    {
      name: "Emeka Eze",
      role: "Backend Developer at Kuda Bank",
      image: "/images/unsplash.jpg",
      testimony:
        "The smart feedback is brutally honest and that is exactly what I needed. It told me my answers were too vague and showed me how to structure them better. My interview performance improved drastically.",
    },
    {
      name: "Ngozi Adeyemi",
      role: "Frontend Developer at Cowrywise",
      image: "/images/deskop.jpg",
      testimony:
        "I recommended AskIt to my entire study group and every single one of us got hired within two months. The platform is genuinely built for Africans navigating the tech job market. Nothing else comes close.",
    },
  ];
  const [numberHowItWorksClick, setNumberHowItWorksClick] = useState<number>(0);
  const scrollNumber = useRef<HTMLDivElement | null>(null);

  const handleNumberHowItWorksClick = (id: number) => {
    if (scrollNumber.current) {
      scrollNumber.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    setNumberHowItWorksClick(id);
  };
  const isMobile = useIsMobile();
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
      <div className=" flex md:flex-row flex-col md:gap-40 gap-15 md:px-20 px-2">
        <div className="underneathImage relative  md:block hidden">
          <Image
            width={700}
            height={500}
            src="/images/desktop.jpg"
            alt="howitworks"
            className="rounded-xl object-center object-cover"
            priority
          />

          <AnimatePresence>
            <MotionImage
              src={`${howItWorksContent[numberHowItWorksClick].images}`}
              alt={`${howItWorksContent[numberHowItWorksClick].heading}-image`}
              width={400}
              height={50}
              className="absolute top-11 left-41.5 object-cover object-top h-55.75 w-[360.8px] rotate-3 rounded-tl"
              priority
              initial={{
                opacity: 1,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 0.98,
              }}
              exit={{
                opacity: 1,
                scale: 0,
              }}
            />
          </AnimatePresence>
        </div>
        <AnimatePresence>
          <div className=" md:hidden block " ref={scrollNumber}>
            <Image
              src={`${howItWorksContent[numberHowItWorksClick].images}`}
              alt={`${howItWorksContent[numberHowItWorksClick].heading}-image`}
              width={300}
              height={300}
              className="w-full h-125 min-w-full  object-cover rounded-2xl"
              priority
            />
          </div>
        </AnimatePresence>

        <div className="aboveImage md:w-[40%] w-full flex flex-col md:gap-10  gap-15">
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

      <section className="md:pt-40 pt-20 ">
        <h1 className="text-center text-2xl font-bold py-30">Features</h1>

        <div className="grid md:grid-cols-2 grid-col-1 place-items-center items-cente gap-10 md:px-40 px-2">
          {features.map((feature, index) => {
            const findBackground = isMobile
              ? [0, 2].includes(index)
              : [0, 3].includes(index);

            const Icon = feature.icon;
            return (
              <motion.div
                initial={{
                  scale: 1,
                }}
                whileHover={{
                  scale: 1.02,
                }}
                key={index}
                className={`${
                  findBackground
                    ? "bg-no-repeat bg-cover shadow-xl border border-foreground text-foreground"
                    : "bg-foreground text-background"
                } md:w-150 w-full h-100 rounded-2xl flex flex-col items-center justify-center gap-5 px-5 text-center cursor-pointer`}
                style={{
                  backgroundImage: findBackground
                    ? "url(/images/unsplash.jpg)"
                    : "none",
                }}
              >
                <div
                  className={`${findBackground ? "bg-gray-600" : "bg-logo-color"} p-5 rounded-full`}
                >
                  <Icon className="text-2xl font-bold" />
                </div>
                <h1
                  className={`${findBackground ? "text-foreground" : "text-logo-color"} text-2xl font-bold`}
                >
                  {feature.heading}
                </h1>
                <h3 className="text-md font-semibold">
                  {feature.secondHeading}
                </h3>
                <p className="text-sm font-medium">{feature.thirdHeading}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="md:pt-60 pt-50 md:px-20 px-0">
        <h1 className="text-logo-color md:text-2xl text-md md:font-bold font-semibold text-center pb-10">
          Testimonials
        </h1>

        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={20}
          slidesPerView={isMobile ? 1 : 3}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
          className=""
        >
          {testimonials.map((testmonial, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="shadow-2xl flex flex-col gap-20 md:p-10 p-5  w-112.5 h-100">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <Image
                        src={`${testmonial.image}`}
                        width={50}
                        height={50}
                        alt="testimonial-image"
                        className="rounded-full object-cover object-center"
                        priority
                      />
                    </div>

                    <div>
                      <h1 className="text-white">{testmonial.name}</h1>
                      <i>{testmonial.role}</i>
                    </div>
                  </div>
                  <blockquote>{testmonial.testimony}</blockquote>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      <section className="md:pt-40 pt-20 md:px-100 px-5 ">
        <div className="bg-logo-color rounded p-10 flex flex-col gap-10">
          <h1 className="text-background md:text-3xl text-xl font-bold text-center">
            Start practicing today and land your next job.
          </h1>

          <div className="flex md:flex-row flex-col items-center md:gap-10 gap-5 justify-center">
            <Link href={"#"}>
              <button className="bg-background p-3 rounded w-50 cursor-pointer text-sm md:text-md">
                Start Interview
              </button>
            </Link>
            <Link href={"#"}>
              <button className="bg-background p-3 rounded w-50  cursor-pointer text-sm md:text-md">
                Upload CV
              </button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-10 justify-center items-center pt-20 md:pt-40  md:px-100 px-5">
        <hr className="border border-logo-color md:w-200 w-full" />
        <div className="flex flex-col justify-center items-center gap-5">
          <div className="logo flex items-center gap-1  font-mono  ">
            <span className="text-logo-color">
              <Bot className="text-xl font-bold" />
            </span>
            <span className="text-xl font-bold text-foreground">AskIt</span>
          </div>
          <blockquote className="text-sm">Made with love by Diamond</blockquote>
        </div>
      </footer>
    </section>
  );
}
