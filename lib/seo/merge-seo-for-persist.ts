import type { PropertyWithRelations } from "@/types";
import type { PropertyFormValues } from "@/lib/validations/property.schema";
import {
  fillBlankPropertySeoFields,
  type PropertySeoSource,
} from "@/lib/seo/property-seo-defaults";

/**
 * Merges an existing DB row with a partial PATCH so we can run the same SEO
 * rules as on create. Undefined patch keys keep the stored value.
 */
export function mergePropertyRowWithPatchForSeo(
  existing: PropertyWithRelations,
  patch: Partial<PropertyFormValues> & Record<string, unknown>,
): PropertySeoSource {
  const p = patch;
  return {
    title:
      p.title !== undefined && p.title !== null
        ? String(p.title)
        : existing.title,
    description:
      p.description !== undefined ? p.description : existing.description,
    short_description:
      p.short_description !== undefined
        ? p.short_description
        : existing.short_description,
    city: p.city !== undefined ? p.city : existing.city,
    type: p.type !== undefined ? p.type : existing.type,
    meta_title: p.meta_title !== undefined ? p.meta_title : existing.meta_title,
    meta_description:
      p.meta_description !== undefined
        ? p.meta_description
        : existing.meta_description,
    meta_keywords:
      p.meta_keywords !== undefined
        ? p.meta_keywords
        : existing.meta_keywords,
  };
}

/** Apply auto-generated meta fields when blanks (manual overrides preserved). */
export function applySeoDefaultsFromFormValues(
  values: Pick<
    PropertyFormValues,
    | "title"
    | "description"
    | "short_description"
    | "city"
    | "type"
    | "meta_title"
    | "meta_description"
    | "meta_keywords"
  >,
) {
  return fillBlankPropertySeoFields({
    title: values.title,
    description: values.description,
    short_description: values.short_description,
    city: values.city,
    type: values.type,
    meta_title: values.meta_title,
    meta_description: values.meta_description,
    meta_keywords: values.meta_keywords,
  });
}
