import HeroSection from "./components/herosection";
import Features from "./components/features";
export default function Home() {
  return (
  
      <section className="md:px-30 px-2 md:py-10 py-5">
        <HeroSection />
        <Features />
      </section>

  );
}
