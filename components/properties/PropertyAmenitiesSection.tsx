"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpDown,
  Baby,
  Building2,
  Camera,
  Car,
  CarFront,
  Dumbbell,
  Droplets,
  Fence,
  Flame,
  Home,
  Leaf,
  Lock,
  Presentation,
  Shield,
  Sparkles,
  Sun,
  Trees,
  Users,
  Waves,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";

function normalizeAmenity(s: string): string {
  return s.toLowerCase().trim();
}

function amenityIcon(name: string): LucideIcon {
  const n = normalizeAmenity(name);

  if (n.includes("wifi") || n.includes("wi-fi") || n.includes("internet"))
    return Wifi;
  if (n.includes("visitor") && n.includes("park")) return CarFront;
  if (n.includes("reserved") && n.includes("park")) return Car;
  if (n.includes("park") || n.includes("parking")) return Car;
  if (n.includes("lift") || n.includes("elevator")) return ArrowUpDown;
  if (n.includes("power") || n.includes("backup") || n.includes("ups"))
    return Zap;
  if (n.includes("gas") || n.includes("piped")) return Flame;
  if (
    n.includes("ac ") ||
    n.includes("a/c") ||
    n.includes("air condition") ||
    n.includes("hvac")
  )
    return Wind;
  if (n.includes("conference") || n.includes("meeting room"))
    return Presentation;
  if (n.includes("hall") && !n.includes("party")) return Building2;
  if (n.includes("multipurpose")) return Users;
  if (n.includes("cctv") || n.includes("camera")) return Camera;
  if (n.includes("security") || n.includes("guard")) return Shield;
  if (n.includes("gated") || n.includes("fence")) return Fence;
  if (n.includes("lock") || n.includes("key card")) return Lock;
  if (n.includes("pool") || n.includes("swim")) return Waves;
  if (n.includes("gym") || n.includes("fitness")) return Dumbbell;
  if (n.includes("garden") || n.includes("park") || n.includes("tree"))
    return Trees;
  if (n.includes("solar")) return Sun;
  if (n.includes("water") || n.includes("bore") || n.includes("sewage"))
    return Droplets;
  if (n.includes("vaastu") || n.includes("vastu") || n.includes("compass"))
    return Sparkles;
  if (
    n.includes("playground") ||
    n.includes("play area") ||
    n.includes("kids") ||
    n.includes("children")
  )
    return Baby;
  if (n.includes("club") || n.includes("lounge")) return Home;
  if (n.includes("eco") || n.includes("green")) return Leaf;

  return Building2;
}

/** Renders every amenity from the property record in one grid (icon + label). */
export function PropertyAmenitiesSection({
  amenities,
}: {
  amenities: string[];
}) {
  const list = useMemo(
    () => amenities.map((a) => a.trim()).filter(Boolean),
    [amenities],
  );

  if (list.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:rounded-2xl sm:p-6 sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <h2 className="mb-4 font-heading text-base font-bold text-[#1a2b4b] sm:mb-5 sm:text-xl">
        Amenities
      </h2>

      <ul
        className="grid grid-cols-2 gap-x-2 gap-y-2 min-[420px]:grid-cols-3 sm:gap-x-5 sm:gap-y-3 md:gap-x-8 md:gap-y-6 lg:gap-y-7"
        aria-label="Property amenities"
      >
        {list.map((label, i) => {
          const Icon = amenityIcon(label);
          return (
            <li
              key={`${label}-${i}`}
              className="flex min-w-0 items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50 sm:gap-3 sm:rounded-xl sm:px-3 sm:py-2.5"
            >
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold sm:h-5 sm:w-5"
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="min-w-0 text-[12px] font-medium leading-snug text-neutral-600 [overflow-wrap:anywhere] sm:text-sm">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
