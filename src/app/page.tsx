import Header from "./components/header";
export default function Home() {
  return (
    <div
      className="w-full h-screen bg-no-repeat bg-cover md:px-20 px-2 md:py-10 py-5"
      style={{ backgroundImage: "url(/images/background.jpg)" }}
    >
      <section>
        <Header/>
      </section>
    </div>
  );
}
