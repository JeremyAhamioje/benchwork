import { MobileCta } from "@/components/mobile-cta";
import { ProjectBriefProvider } from "@/components/project-brief-context";
import { About } from "@/components/sections/about";
import { Booking } from "@/components/sections/booking";
import { Capabilities } from "@/components/sections/capabilities";
import { Disciplines } from "@/components/sections/disciplines";
import { Estimator } from "@/components/sections/estimator/estimator";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Showcase } from "@/components/sections/showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Hero />
        <Disciplines />
        <Capabilities />
        <Process />

        {/* The estimator hands its result to the booking form through context,
            so both live inside the same provider. */}
        <ProjectBriefProvider>
          <Estimator />
          <Showcase />
          <About />
          <Booking />
        </ProjectBriefProvider>
      </main>

      <SiteFooter />
      <MobileCta />
    </>
  );
}
