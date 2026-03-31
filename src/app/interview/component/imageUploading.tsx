"use client";
import { AudioLines, SendHorizontal, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
// const MotionImage = motion(Image);

export default function ImageUploading() {
  return (
    <section className="w-full h-screen flex md:justify-between md:items-center ">
      <motion.div
        initial={{
          x: "-200vw",
        }}
        animate={{
          x: 1,
        }}
        transition={{
          duration: 1,
        }}
        className="chat w-[20%] h-screen p-10 md:flex flex-col gap-10 bg-linear-to-br from-black to-blue-950 hidden "
      >
        <h1 className="text-logo-color text-xl font-bold">Chat History</h1>

        <ul className="history list-none overflow-hidden flex flex-col gap-2">
          {/* bg-linear-to-r from-black to-gray-600 */}

          <motion.li
            initial={{ backgroundImage: "none" }}
            whileHover={{
              backgroundImage: "linear-gradient(to right, #000000, #4b5563)",
            }}
            transition={{ duration: 0.6 }}
            className="py-3  rounded shadow cursor-pointer text-white"
          >
            Arisegadget
          </motion.li>
          <motion.li
            initial={{ backgroundImage: "none" }}
            whileHover={{
              backgroundImage: "linear-gradient(to right, #000000, #4b5563)",
            }}
            transition={{ duration: 0.6 }}
            className="py-3  rounded shadow cursor-pointer text-white"
          >
            Arisegadget
          </motion.li>
          <motion.li
            initial={{ backgroundImage: "none" }}
            whileHover={{
              backgroundImage: "linear-gradient(to right, #000000, #4b5563)",
            }}
            transition={{ duration: 0.6 }}
            className="py-3  rounded shadow cursor-pointer text-white"
          >
            Arisegadget
          </motion.li>
        </ul>
      </motion.div>





      <div className="save md:w-[80%] w-full h-auto bg-linear-to-br from-black to-blue-950 py-20 md:px-50 px-5 flex flex-col gap-3 relative">
        <div className="w-90 flex items-center gap-5 justify-center md:text-md text-sm text-center bg-linear-to-r from-black to-blue-950 py-3 rounded-3xl mx-auto">
          <div>Choose your interview mode</div>
          <select
            name=""
            id=""
            className="cursor-pointer border-none outline-none"
          >
            <option className="border-none outline-none cursor-pointer bg-transparent">
              🎤 Audio
            </option>
            <option className="border-none outline-none cursor-pointer">
              💬 Text
            </option>
          </select>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 ">
          <h1 className="text-logo-color md:text-3xl text-2xl font-bold">
            Upload your CV to begin
          </h1>
          <h3 className="text-md  text-center font-semibold">
            Our AI will tailor interview questions based on your experience
          </h3>

          {/* <div className="flex flex-col gap-5 items-center border border-dotted border-logo-color rounded-2xl w-150 p-10 cursor-pointer ">
            <Upload />
            <input type="file" name="" id="" />
            <h4 className="text-md font-semibold">Drag & drop your CV here</h4>
            <i className="text-sm">PDF, DOCX supported · or click to browse</i>
          </div> */}
        </div>
        <AnimatePresence>
          <motion.div
            initial={{
              x: "-200vw",
            }}
            animate={{
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
            exit={{
              x: "-200vw",
            }}
            className="flex flex-col justify-center items-center  gap-10 py-30"
          >
            <Image
              width={200}
              height={200}
              priority
              alt="ai-image"
              src="/images/cyber-face.png"
              className="rounded-full"
            />

            <h1 className="md:text-4xl text-xl  font-bold md:px-40 p-5 text-center">
              Do you want to start your{" "}
              <span className="text-logo-color">interview Journey </span> today
              ?
            </h1>
          </motion.div>
        </AnimatePresence>

        <div className="chatarea flex flex-col gap-10">
          {/* AI Message (left) */}
          <div className="flex w-full justify-start">
            <div className="flex items-start gap-3 md:max-w-[70%] max-w-full">
              <Image
                width={40}
                height={40}
                priority
                alt="ai-image"
                src="/images/cyber-face.png"
                className="rounded-full md:block hidden"
              />
              <h1 className="bg-gray-800 text-white p-3 rounded-lg">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At sint
                voluptatem provident reprehenderit quis voluptatum expedita
                recusandae repudiandae doloremque laborum libero minus est
                suscipit nesciunt alias ullam, ipsum sequi quas.
              </h1>
            </div>
          </div>

          {/* User Message (right) */}
          <div className="flex w-full md:justify-end">
            <div className="md:max-w-[70%] max-w-full bg-blue-600 text-white p-3 rounded-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae accusamus illo maiores sunt non expedita cum nemo
              praesentium iusto obcaecati numquam natus, corporis iste voluptate
              sapiente, velit tempore at eius.
            </div>
          </div>
        </div>

        <div className="messagesender bg-blue-950 rounded-xl p-6 md:w-[60%] w-full md:h-30 h-20  flex md:flex-col flex-row md:gap-0 gap-5 fixed  bottom-5  md:left-[30%] left-0 right-0 px-3  ">
          <textarea
            className="border-none outline-none resize-none w-full h-10"
            placeholder="Ask me anything ..."
          ></textarea>

          <div className="flex justify-between gap-3 items-center">
            <div className="upload cursor-pointer">
              <Upload />
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-logo-color p-2 cursor-pointer">
                <AudioLines />
              </div>
              <div className="rounded-full bg-gray-500 p-2 cursor-pointer">
                <SendHorizontal />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// shadow-[6px_0px_0px_0px_rgba(0,0,0,0.2)]
