"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import BrandPhoto from "@/components/auth/BrandPhoto";
import { getPostLoginPath } from "@/lib/auth";
import SocialLinks from "@/components/layout/SocialLinks";
import CityVibeBackground from "@/components/layout/CityVibeBackground";

type Tab = "signin" | "signup";

function PinInput({
  value,
  onChange,
  id,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
  label: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    onChange(digits);
  };

  return (
    <div>
      <label htmlFor={id} className="text-sm text-cream/70 block mb-1">
        {label}
      </label>
      <input
        id={id}
        type="password"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        minLength={4}
        value={value}
        onChange={handleChange}
        placeholder="••••"
        className="w-full px-4 py-3 bg-navy border border-gold/30 rounded-md text-cream text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-gold"
        autoComplete={id.includes("confirm") ? "new-password" : "current-password"}
      />
      <p className="text-xs text-cream/40 mt-1">4 digits only (numbers)</p>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signin");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(form.password)) {
      toast.error("Password must be exactly 4 digits");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or PIN");
      return;
    }

    toast.success("Welcome back!");
    router.push(getPostLoginPath(form.email));
    router.refresh();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(form.password)) {
      toast.error("Password must be exactly 4 digits");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("PINs do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Sign up failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.success("Account created! Please sign in.");
        setTab("signin");
        setLoading(false);
        return;
      }

      toast.success("Account created!");
      router.push(getPostLoginPath(form.email));
      router.refresh();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <CityVibeBackground imageIndex={3} overlayClassName="bg-navy/90">
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: brand photo */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 border-r border-gold/20 bg-navy/40 backdrop-blur-sm">
        <div className="max-w-lg w-full space-y-6">
          <BrandPhoto />
          <p className="text-center text-cream/50 text-sm">
            {/* Replace brand-photo.jpg in /public folder with your photo */}
            Drag your photo into{" "}
            <code className="text-gold">public/brand-photo.jpg</code>
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="block text-center mb-8">
            <span className="font-heading text-2xl text-gold tracking-wider">
              YZAK LUXURY BRAND
            </span>
          </Link>

          {/* Mobile brand photo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-48">
              <BrandPhoto />
            </div>
          </div>

          <div className="flex rounded-lg overflow-hidden border border-gold/30 mb-8">
            {(["signin", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === t
                    ? "bg-gold text-navy"
                    : "bg-card text-cream/70 hover:text-gold"
                }`}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {tab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-sm text-cream/70 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-gold/20 rounded-md text-cream focus:outline-none focus:border-gold"
                />
              </div>
              <PinInput
                id="signin-pin"
                label="4-Digit PIN"
                value={form.password}
                onChange={(password) => setForm({ ...form, password })}
              />
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-sm text-cream/70 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-gold/20 rounded-md text-cream focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-sm text-cream/70 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-gold/20 rounded-md text-cream focus:outline-none focus:border-gold"
                />
              </div>
              <PinInput
                id="signup-pin"
                label="Create 4-Digit PIN"
                value={form.password}
                onChange={(password) => setForm({ ...form, password })}
              />
              <PinInput
                id="signup-pin-confirm"
                label="Confirm PIN"
                value={form.confirmPassword}
                onChange={(confirmPassword) =>
                  setForm({ ...form, confirmPassword })
                }
              />
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Create Account
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gold/20">
            <p className="text-cream/50 text-xs text-center mb-3">Need help?</p>
            <SocialLinks className="justify-center" showPhone />
          </div>

          <p className="text-center mt-6">
            <Link href="/" className="text-gold text-sm hover:underline">
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
    </CityVibeBackground>
  );
}
