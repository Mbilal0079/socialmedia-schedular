import "@/app/landing.css";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import {
  Features,
  HowItWorks,
  Stats,
  Testimonials,
  Pricing,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/landing/Sections";

export const metadata = {
  title: "PostPilot — Schedule Posts to Every Platform at Once",
  description:
    "Write once. PostPilot publishes to Twitter, LinkedIn, Facebook, and Instagram automatically at exactly the time you choose. Powered by BullMQ. Free to start.",
  openGraph: {
    title: "PostPilot — Social Media Scheduling",
    description: "Schedule posts to every platform at once. No credit card required.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
