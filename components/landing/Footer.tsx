import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS, CONTACT } from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { SocialPlatform } from "@/lib/constants/site";

const pages = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const explore = [
  { label: "Post Property", href: "/post-property" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Wishlist", href: "/wishlist" },
];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 pb-12 sm:pb-14 border-b border-white/15">
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
            <p className="text-white/60 text-base leading-relaxed max-w-sm mb-7 sm:mb-8">
              We provide exceptional real estate services, helping you find the
              perfect property that fits your lifestyle and budget.
            </p>
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
          <FooterLinkColumn title="Legal" links={legal} />
        </div>

        <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-sm text-white/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-site-wordmark font-normal text-white/55">
              {SITE_NAME}
            </span>
            . All Rights Reserved.
          </div>
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-sm text-white/40 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
          >
            {CONTACT.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
