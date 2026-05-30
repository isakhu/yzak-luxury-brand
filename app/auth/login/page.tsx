"use client";

import Link from "next/link";
import { ArrowRight, Gem, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import BrandPhoto from "@/components/auth/BrandPhoto";
import SocialLinks from "@/components/layout/SocialLinks";
import CityVibeBackground from "@/components/layout/CityVibeBackground";

export default function LoginPage() {
  return (
    <CityVibeBackground imageSrc="/brand-photo.jpg" overlayClassName="bg-navy/45">
      <main className="min-h-screen flex flex-col lg:flex-row">
        <section className="flex-1 flex items-center justify-center px-6 py-10 lg:p-12">
          <div className="w-full max-w-xl">
            <BrandPhoto />
          </div>
        </section>

        <section className="flex-1 flex items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-md text-center bg-navy/45 border border-gold/20 rounded-lg p-6 sm:p-8 backdrop-blur-sm">
            <p className="text-gold text-sm tracking-[0.28em] uppercase mb-3">
              Welcome
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl text-gold mb-4">
              Yzak Luxury Brand
            </h1>
            <p className="text-cream/75 leading-relaxed mb-8">
              Discover gold, diamonds, fashion, shoes, watches, handbags, and
              accessories curated for Ethiopia.
            </p>

            <div className="space-y-3">
              <Link href="/home">
                <Button size="lg" className="w-full">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Enter Store
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/products/gold">
                <Button size="lg" variant="outline" className="w-full">
                  <Gem className="w-5 h-5 mr-2" />
                  View Products
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gold/20">
              <p className="text-cream/50 text-xs text-center mb-3">
                Contact Yzak
              </p>
              <SocialLinks className="justify-center" showPhone />
            </div>
          </div>
        </section>
      </main>
    </CityVibeBackground>
  );
}
