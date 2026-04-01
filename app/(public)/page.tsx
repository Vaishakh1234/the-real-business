import { Hero } from "@/components/landing/Hero";
import {
  HomeExplorePropertyList,
  HomeExploreSectionIntro,
} from "@/components/landing/HomeExploreProperties";
import { HomePortalLayout } from "@/components/landing/HomePortalLayout";
import { HomeSidebar } from "@/components/landing/HomeSidebar";
import { HomeCoreValuesSection } from "@/components/landing/HomeCoreValuesSection";
import { SITE_NAME } from "@/lib/constants/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Palakkad plots, land & homes`,
  description:
    "Browse curated sale and rental listings in Palakkad district, Kerala. Local real estate brokerage — we work with owners in person before marketing.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HomePortalLayout>
        <section
          className="min-w-0 w-full"
          aria-labelledby="home-explore-heading"
        >
          <HomeExploreSectionIntro />
          <div className="mt-8 grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_min(100%,380px)] xl:gap-10 2xl:gap-12">
            <div className="min-w-0 w-full">
              <HomeExplorePropertyList />
            </div>
            <HomeSidebar />
          </div>
        </section>
        <div className="mt-14 sm:mt-16 lg:mt-20">
          <HomeCoreValuesSection />
        </div>
      </HomePortalLayout>
    </>
  );
}
