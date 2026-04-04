import {
  BreadcrumbsSkeleton,
  LegalHeroSkeleton,
  NumberedItemsSkeleton,
} from "@/components/landing/skeletons/LandingSkeletons";

export default function PrivacyLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />
      <LegalHeroSkeleton />
      <NumberedItemsSkeleton count={9} />
    </>
  );
}
