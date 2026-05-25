"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Yzak Luxury Brand",
    hawassaPhone: "",
    hawassaAddress: "",
    direDawaPhone: "",
    direDawaAddress: "",
    whatsappNumber: "",
  });
  const [promoteEmail, setPromoteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) setSettings(data);
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) toast.success("Settings saved");
    else toast.error("Failed to save");
    setLoading(false);
  };

  const handlePromote = async () => {
    if (!promoteEmail) return;
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: promoteEmail }),
    });
    if (res.ok) {
      toast.success(`${promoteEmail} promoted to ADMIN`);
      setPromoteEmail("");
    } else {
      toast.error("User not found");
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-3xl text-gold mb-8">Settings</h1>

      <div className="bg-card rounded-lg p-6 border border-gold/20 space-y-4 mb-8">
        <h2 className="font-heading text-lg text-gold">Store Information</h2>
        {Object.entries(settings).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm text-cream/70 capitalize block mb-1">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              value={value}
              onChange={(e) =>
                setSettings({ ...settings, [key]: e.target.value })
              }
              className="w-full px-4 py-2 bg-navy border border-gold/20 rounded text-cream text-sm"
            />
          </div>
        ))}
        <Button onClick={handleSave} loading={loading} className="w-full">
          Save Settings
        </Button>
      </div>

      <div className="bg-card rounded-lg p-6 border border-gold/20 space-y-4">
        <h2 className="font-heading text-lg text-gold">Promote User to Admin</h2>
        <p className="text-cream/60 text-sm">
          Enter the email of a registered user. They will be granted admin
          access.
        </p>
        <input
          type="email"
          value={promoteEmail}
          onChange={(e) => setPromoteEmail(e.target.value)}
          placeholder="user@gmail.com"
          className="w-full px-4 py-2 bg-navy border border-gold/20 rounded text-cream"
        />
        <Button onClick={handlePromote} variant="outline" className="w-full">
          Promote to Admin
        </Button>
      </div>
    </div>
  );
}
