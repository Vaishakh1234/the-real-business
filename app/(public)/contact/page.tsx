import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactPageClient } from "@/components/contact/ContactPageClient";

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        currentPath="/contact"
      />
      <ContactPageClient />
    </>
  );
}
