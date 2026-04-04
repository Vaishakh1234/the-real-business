import {
  BreadcrumbsSkeleton,
  LegalHeroSkeleton,
  NumberedItemsSkeleton,
} from "@/components/landing/skeletons/LandingSkeletons";

export default function TermsLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />
      <LegalHeroSkeleton />
      <NumberedItemsSkeleton count={8} />
    </>
  );
}
