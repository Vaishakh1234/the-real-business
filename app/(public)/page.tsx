import { Hero } from "@/components/landing/Hero";
import {
  HomeExplorePropertyList,
  HomeExploreSectionIntro,
} from "@/components/landing/HomeExploreProperties";
import { HomePortalLayout } from "@/components/landing/HomePortalLayout";
import { HomeSidebar } from "@/components/landing/HomeSidebar";
import { HomeFAQ } from "@/components/landing/FAQ";
import { Testimonials } from "@/components/landing/Testimonials";
import { SITE_NAME } from "@/lib/constants/site";
import type { Metadata } from "next";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";

const homeTitle = `${SITE_NAME} — Real Estate Marketing & Property Consultancy, Palakkad`;
const homeDescription =
  "Browse curated listings in Palakkad, Kerala. Real estate marketing, property consultancy, and buying & selling support — we meet owners and walk properties before we recommend or market.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: { canonical: "/" },
  ...defaultPageOgTwitter("/", homeTitle, homeDescription),
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
      </HomePortalLayout>
      <HomeFAQ />
      <Testimonials />
    </>
  );
}
