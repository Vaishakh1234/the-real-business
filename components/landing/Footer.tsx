import Link from "next/link";
import { SEO_AREAS } from "@/lib/constants/areas";
import { SITE_NAME, SOCIAL_LINKS, CONTACT } from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { SocialIcon } from "@/components/ui/SocialIcon";

const pages = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const explore = [
  { label: "Post Property", href: "/post-property" },
  { label: "Areas in Palakkad", href: "/areas" },
  { label: "Guides", href: "/guides" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "Wishlist", href: "/wishlist" },
];

const areaLinks = SEO_AREAS.map((a) => ({
  label: `Properties in ${a.name}`,
  href: `/areas/${a.slug}`,
}));

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-sm uppercase tracking-widest text-white/50 mb-5 sm:mb-6 font-medium">
        {title}
      </div>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block py-2 text-base leading-snug text-white/60 transition-colors hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white pt-16 sm:pt-20 pb-24 md:pb-10">
      <div className={publicContentFrameClass}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 sm:gap-12 pb-12 sm:pb-14 border-b border-white/15">
          <div className="sm:col-span-2">
            <Link
              href="/"
              className="inline-block mb-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal rounded"
            >
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white uppercase leading-tight">
                <span className="block">The Real</span>
                <span className="block">Business</span>
              </span>
            </Link>
            <p className="text-white/60 text-base leading-relaxed max-w-sm mb-5 sm:mb-6">
              Real estate marketing, property consultancy, and buying &amp;
              selling support in Palakkad, Kerala — curated listings and local
              expertise from first conversation to registration.
            </p>
            <address className="not-italic text-white/60 text-sm leading-relaxed space-y-1 mb-6 sm:mb-7">
              <p>
                {CONTACT.address.line1}, {CONTACT.address.city}
              </p>
              <p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hover:text-brand-gold transition-colors"
                >
                  {CONTACT.email}
                </a>
              </p>
              {CONTACT.phone && (
                <p>
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="hover:text-brand-gold transition-colors"
                  >
                    {CONTACT.phone}
                  </a>
                </p>
              )}
            </address>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-brand-gold hover:border-brand-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkColumn title="Pages" links={pages} />
          <FooterLinkColumn title="Explore" links={explore} />
          <FooterLinkColumn title="Local areas" links={areaLinks} />
          <FooterLinkColumn title="Legal" links={legal} />
        </div>

        <div className="pt-8 sm:pt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-site-wordmark font-normal text-white/55">
              {SITE_NAME}
            </span>
            . All Rights Reserved.
          </div>
          <Link
            href="/admin/login"
            className="text-sm font-medium text-white/70 transition-colors hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal rounded text-center sm:text-right"
          >
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
