import { PropertiesPageSkeleton } from "@/components/properties/PropertiesPageSkeleton";

/** Route-level fallback; matches `PropertiesClient` data skeleton and dynamic import loading. */
export default function PropertiesLoading() {
  return <PropertiesPageSkeleton />;
}
