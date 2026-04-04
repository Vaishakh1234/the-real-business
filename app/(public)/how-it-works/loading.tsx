import {
  BreadcrumbsSkeleton,
  LegalHeroSkeleton,
  NumberedItemsSkeleton,
} from "@/components/landing/skeletons/LandingSkeletons";

export default function HowItWorksLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />
      <LegalHeroSkeleton />
      <NumberedItemsSkeleton count={3} />
    </>
  );
}
