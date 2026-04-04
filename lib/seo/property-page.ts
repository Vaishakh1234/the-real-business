import { cache } from "react";
import {
  getPropertyByIdOrSlug,
  isPublicPropertyListingStatus,
} from "@/lib/queries/properties";
import type { PropertyWithRelations } from "@/types";

/**
 * Single fetch per request for public property detail metadata + JSON-LD + page.
 */
export const getCachedActivePropertyByIdentifier = cache(
  async (
    identifier: string,
  ): Promise<PropertyWithRelations | null> => {
    const trimmed = identifier?.trim();
    if (!trimmed) return null;
    const property = await getPropertyByIdOrSlug(trimmed);
    if (!property || !isPublicPropertyListingStatus(property.status)) {
      return null;
    }
    return property;
  },
);
