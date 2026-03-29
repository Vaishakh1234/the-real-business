import type { PropertyStatus } from "@/types";

export function propertyStatusBadgeClass(status: PropertyStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-600 text-white";
    case "draft":
      return "bg-neutral-500 text-white";
    case "sold":
    case "rented":
    case "closed":
      return "bg-neutral-600 text-white";
    default:
      return "bg-neutral-500 text-white";
  }
}

export function propertyStatusLabel(status: PropertyStatus): string {
  switch (status) {
    case "active":
      return "Available";
    case "draft":
      return "Draft";
    case "sold":
      return "Sold";
    case "rented":
      return "Rented";
    case "closed":
      return "Closed";
    default:
      return status;
  }
}
