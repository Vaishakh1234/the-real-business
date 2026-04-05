import { z } from "zod";
import { isValidMapUrl, sanitizeGoogleMapsUrlInput } from "@/lib/map-url";

export const propertySchema = z.object({
  title: z.string().min(1, "Please enter the listing title"),
  slug: z.string().optional(),
  description: z
    .string()
    .max(200_000, "Description is too long")
    .nullable()
    .optional(),
  short_description: z
    .string()
    .max(250, "Please keep to 250 characters or less")
    .nullable()
    .optional(),
  type: z.enum(["sale", "rent"], { required_error: "Please select type (sale or rent)" }),
  /** Building vs land plot — controls which specification fields apply. */
  structure_type: z.enum(["house", "plot", "building"]).default("house"),
  status: z.enum(["active", "sold", "rented", "draft", "closed"]).default("active"),
  is_featured: z.boolean().default(false),
  category_id: z.string().uuid().nullable().optional(),
  price: z
    .number({ required_error: "Please enter the price", invalid_type_error: "Please enter a valid number for price" })
    .min(0, "Please enter 0 or more for price"),
  price_type: z.enum(["total", "percent"]).default("total"),
  area_sqft: z.number().min(0).nullable().optional(),
  /** Land extent in cents (decimal allowed). */
  total_cent: z.number().min(0).nullable().optional(),
  bedrooms: z.number().int().min(0).nullable().optional(),
  bathrooms: z.number().int().min(0).nullable().optional(),
  floors: z.number().int().min(0).nullable().optional(),
  facing: z.string().nullable().optional(),
  furnished: z.enum(["furnished", "semi-furnished", "unfurnished"]).nullable().optional(),
  address: z.string().min(1, "Please enter the address"),
  city: z.string().min(1, "Please enter the city"),
  state: z.string().min(1, "Please enter the state"),
  zip_code: z.string().max(20).nullable().optional().or(z.literal("")),
  country: z.string().default("India"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  map_embed_url: z
    .string()
    .nullable()
    .or(z.literal(""))
    .optional()
    .refine(
      (v) => {
        const s = v == null ? "" : sanitizeGoogleMapsUrlInput(String(v));
        return s === "" || isValidMapUrl(s);
      },
      {
        message:
          "Please enter a valid Google Maps URL (Share → copy link, embed, or maps.app.goo.gl). Add latitude/longitude so the map can load if the link cannot be embedded.",
      },
    )
    .transform((v) =>
      v != null && String(v).trim() !== "" ? sanitizeGoogleMapsUrlInput(String(v)) : null,
    ),
  cover_image_url: z
    .string()
    .url("Please provide a valid cover image URL")
    .nullable()
    .or(z.literal(""))
    .refine((v) => v != null && String(v).trim() !== "", {
      message: "Please add a cover image",
    }),
  gallery_images: z.array(z.string().url()).nullable().optional(),
  amenities: z.array(z.string()).nullable().optional(),
  tags: z.array(z.string().max(40)).max(25).nullable().optional(),
  highlights: z.array(z.string()).nullable().optional(),
  plot_number: z.string().nullable().optional(),
  plot_dimensions: z.string().nullable().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  meta_keywords: z.string().nullable().optional(),
  og_image_url: z.string().url().nullable().or(z.literal("")).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
