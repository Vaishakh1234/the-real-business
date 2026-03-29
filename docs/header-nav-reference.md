# Public header navigation — design reference

This document describes how the marketing site header behaves and what visual pattern it follows, so future changes stay consistent.

## Reference screenshot

A captured reference (Housing.com–style mega-dropdown) lives in the repo:

- `docs/references/housing-nav-dropdown-reference.png`

Use it when tuning spacing, shadows, or typography in the desktop hover panels.

## Layout (desktop)

- **Bar height:** Slightly elevated app bar (`h-14` mobile, `md:h-[4.75rem]` desktop) so triggers and logo stay readable without dominating the viewport.
- **Left:** Logo + site wordmark (links home).
- **Center:** Primary sections with **chevron-down** affordance on each trigger. Hovering a trigger opens its panel; moving the pointer into the panel keeps it open (bridge padding under the trigger avoids flicker).
- **Right:** Primary CTA (`Get in Touch` → `/contact`).

## Hover panel (“modal”) pattern

Each panel matches the reference:

1. **Container:** White background, **rounded corners** (`rounded-xl`), **light border**, **soft shadow** (large blur, low opacity).
2. **Caret:** Small **upward-pointing triangle** centered on the trigger, visually connecting the panel to the nav item.
3. **Eyebrow:** Small, **muted** uppercase or sentence label (e.g. “Explore homes”) above the links.
4. **Rows:** Each destination is a **bold title** with a **smaller muted subtitle** underneath (two-line row), full row clickable.
5. **Interaction:** Open while pointer is over trigger **or** panel; **Escape** closes any open panel; triggers use `aria-expanded` / `aria-haspopup` for assistive tech.

## Mobile

- Bottom tab bar is unchanged: direct links to Home, Properties, About, Services, Contact with icons.
- Hover panels are **desktop-only** (`md:` and up).

## Content mapping

Nav labels follow a marketplace-style IA; URLs map to this codebase:

| Section        | Purpose                          | Typical destinations                                      |
| -------------- | -------------------------------- | --------------------------------------------------------- |
| For Buyers     | Purchase flow                    | `/properties?type=sale`, `/properties`, `/how-it-works`   |
| For Tenants    | Rentals                          | `/properties?type=rent`, `/how-it-works`, `/contact`      |
| For Sellers    | List / partner                   | `/contact`, `/services`, `/about`                         |
| Services       | Service lines                    | `/services`, footer-style deep links to `/contact`        |
| Guides & Legal | Trust, team, policies            | `/about`, `/team`, `/terms`, `/privacy`                   |

Update this table when routes or labels change.

## Implementation

- Component: `components/landing/Navbar.tsx`
- Main content offset: `app/(public)/layout.tsx` (`pt-*` must match header height)

After changing header height, update **both** the header `nav` height classes and the layout `main` top padding so pages do not sit under the fixed bar.
