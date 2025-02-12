
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <main className="bg-dark">
      <Hero />
      <Features />
      <Pricing />
      <Blog />
      <Contact />
    </main>
  );
};

export default Index;
