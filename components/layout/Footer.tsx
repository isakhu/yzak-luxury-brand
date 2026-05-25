import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/utils";
import { CONTACT } from "@/lib/contact";
import SocialLinks from "@/components/layout/SocialLinks";

export default async function Footer() {
  let settings = {
    hawassaPhone: CONTACT.phone,
    hawassaAddress: CONTACT.hawassaAddress,
    direDawaPhone: CONTACT.phone,
    direDawaAddress: "Dire Dawa, Ethiopia",
  };

  try {
    const dbSettings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
    });
    if (dbSettings) {
      settings = {
        hawassaPhone: dbSettings.hawassaPhone || CONTACT.phone,
        hawassaAddress: dbSettings.hawassaAddress || CONTACT.hawassaAddress,
        direDawaPhone: dbSettings.direDawaPhone || CONTACT.phone,
        direDawaAddress: dbSettings.direDawaAddress || settings.direDawaAddress,
      };
    }
  } catch {
    // Use defaults if DB unavailable
  }

  return (
    <footer className="bg-card border-t border-gold/20 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl text-gold mb-4">
              YZAK LUXURY BRAND
            </h3>
            <p className="text-cream/70 text-sm mb-4">
              Ethiopia&apos;s premier luxury destination for gold, diamonds,
              fashion, and accessories.
            </p>
            <SocialLinks showPhone />
          </div>

          <div>
            <h4 className="font-heading text-gold mb-3">Hawassa Branch</h4>
            <p className="text-cream/70 text-sm">{settings.hawassaAddress}</p>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="text-gold text-sm mt-1 block hover:underline"
            >
              {CONTACT.phone}
            </a>
          </div>

          <div>
            <h4 className="font-heading text-gold mb-3">Contact & Social</h4>
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-sm block hover:underline mb-1"
            >
              WhatsApp
            </a>
            <a
              href={CONTACT.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-sm block hover:underline mb-3"
            >
              Telegram @yzak_22
            </a>
            <SocialLinks showPhone={false} />
          </div>

          <div>
            <h4 className="font-heading text-gold mb-3">Categories</h4>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="text-cream/70 text-sm hover:text-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-8 pt-6 text-center text-cream/50 text-sm">
          © {new Date().getFullYear()} Yzak Luxury Brand. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
