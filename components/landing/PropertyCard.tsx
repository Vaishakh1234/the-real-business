import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Sparkles,
  Ruler,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  PropertyNativeImg,
  PROPERTY_PLACEHOLDER_SRC,
} from "@/components/ui/PropertyImage";
import type { PropertyStructureType, PropertyWithRelations } from "@/types";
import { formatPropertyPriceValue } from "@/lib/utils";

interface PropertyCardProps {
  property: PropertyWithRelations;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const structureKind: PropertyStructureType =
    property.structure_type === "plot"
      ? "plot"
      : property.structure_type === "building"
        ? "building"
        : "house";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-brand-gold/30">
      {/* Image */}
      <div className="relative h-52 bg-muted overflow-hidden">
        {property.cover_image_url ? (
          <PropertyNativeImg
            src={property.cover_image_url}
            alt={property.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={PROPERTY_PLACEHOLDER_SRC}
            alt="No photo available"
            className="h-full w-full object-contain bg-[#eef4fb]"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            className={
              property.type === "sale"
                ? "bg-brand-charcoal text-white border-0"
                : "bg-brand-gold text-white border-0"
            }
          >
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-brand-charcoal leading-snug line-clamp-1 group-hover:text-brand-gold transition-colors">
            {property.title}
          </h3>
        </div>
        {property.listing_ref ? (
          <p className="text-[11px] font-mono text-muted-foreground tabular-nums mb-2">
            {property.listing_ref}
          </p>
        ) : null}

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {property.city}, {property.state}
          </span>
        </div>

        {property.short_description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {property.short_description}
          </p>
        )}
        {Array.isArray(property.amenities) && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md"
              >
                <Sparkles className="h-2.5 w-2.5" />
                {a}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{property.amenities.length - 4}
              </span>
            )}
          </div>
        )}
        {/* Property specs */}
        {(structureKind === "house"
          ? property.bedrooms ||
            property.bathrooms ||
            (property.area_sqft != null && Number(property.area_sqft) > 0)
          : structureKind === "building"
            ? (property.area_sqft != null && Number(property.area_sqft) > 0) ||
              property.floors
            : property.plot_dimensions?.trim() ||
              property.plot_number?.trim() ||
              property.total_cent != null) && (
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
            {structureKind === "house" && property.bedrooms != null && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}
            {structureKind === "house" && property.bathrooms != null && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {structureKind !== "plot" &&
              property.area_sqft != null &&
              Number(property.area_sqft) > 0 && (
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                  <span>{property.area_sqft} sqft</span>
                </div>
              )}
            {structureKind !== "plot" && property.floors != null && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
                <span>{property.floors} Floors</span>
              </div>
            )}
            {structureKind === "plot" && property.plot_dimensions?.trim() && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Ruler className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {property.plot_dimensions.trim()}
                </span>
              </div>
            )}
            {structureKind === "plot" && property.plot_number?.trim() && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{property.plot_number.trim()}</span>
              </div>
            )}
          </div>
        )}

        {/* Price + Category */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold tabular-nums text-brand-charcoal">
              {formatPropertyPriceValue(property.price, property.price_type)}
              <span className="text-sm font-medium text-muted-foreground">
                {property.price_type === "percent" ? " / Per cent" : " / Total"}
              </span>
            </p>
          </div>
          {property.category && (
            <Badge variant="secondary" className="text-xs">
              {property.category.name}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
