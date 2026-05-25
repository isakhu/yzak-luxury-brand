"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { CONTACT } from "@/lib/contact";
import SocialLinks from "@/components/layout/SocialLinks";
import { CITY_VIBE_IMAGES } from "@/lib/images";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Image
        src={CITY_VIBE_IMAGES[2]}
        alt=""
        fill
        className="object-cover fixed inset-0 -z-10 brightness-[0.25]"
        sizes="100vw"
      />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl text-gold mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-center text-cream/60 mb-8">
          <SocialLinks className="justify-center" showPhone />
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-card/95 rounded-lg p-6 border border-gold/20 backdrop-blur-sm">
            <h2 className="font-heading text-xl text-gold mb-4">
              Hawassa Branch
            </h2>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2 text-cream/80">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                {CONTACT.hawassaAddress}
              </p>
              <SocialLinks showPhone />
              <p className="flex items-center gap-2 text-cream/70">
                <Clock className="w-4 h-4 text-gold" />
                {CONTACT.hours}
              </p>
            </div>
          </div>

          <div className="bg-card/95 rounded-lg p-6 border border-gold/20 backdrop-blur-sm">
            <h2 className="font-heading text-xl text-gold mb-4">Reach Us Online</h2>
            <div className="space-y-3 text-sm text-cream/80">
              <p>
                Call or message us anytime on WhatsApp or Telegram for orders and
                inquiries.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  WhatsApp: {CONTACT.phone}
                </a>
                <a
                  href={CONTACT.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  Telegram: @yzak_22
                </a>
              </div>
              <SocialLinks showPhone />
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto bg-card/95 rounded-lg p-6 border border-gold/20 backdrop-blur-sm">
          <h2 className="font-heading text-xl text-gold mb-4">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Name", required: true },
              { key: "email", label: "Email", type: "email", required: true },
              { key: "phone", label: "Phone" },
              { key: "subject", label: "Subject" },
            ].map(({ key, label, type, required }) => (
              <div key={key}>
                <label className="text-sm text-cream/70 block mb-1">{label}</label>
                <input
                  type={type || "text"}
                  required={required}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-2 bg-navy border border-gold/20 rounded text-cream"
                />
              </div>
            ))}
            <div>
              <label className="text-sm text-cream/70 block mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2 bg-navy border border-gold/20 rounded text-cream resize-none"
              />
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
