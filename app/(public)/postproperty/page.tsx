import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Alias for `/post-property` (closer to common portal URL shape). */
export default async function PostPropertyAliasPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = sp.ctaSource;
  const ctaSource =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const q = new URLSearchParams();
  if (ctaSource) q.set("ctaSource", ctaSource);
  const suffix = q.toString();
  redirect(suffix ? `/post-property?${suffix}` : "/post-property");
}
