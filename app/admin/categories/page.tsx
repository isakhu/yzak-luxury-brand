"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", image: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () =>
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    const payload = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name,
      slug: form.slug || form.name.toLowerCase(),
      image: form.image || null,
    };
    const res = await fetch("/api/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editing ? "Updated" : "Created");
      setModalOpen(false);
      load();
    } else {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/categories?id=${deleteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted");
      load();
    } else {
      toast.error("Cannot delete category with products");
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-gold">Categories</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({ name: "", slug: "", image: "" });
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between bg-card rounded-lg p-4 border border-gold/20"
          >
            <div>
              <p className="font-medium text-cream">{cat.name}</p>
              <p className="text-cream/50 text-sm">
                /{cat.slug} · {cat._count?.products || 0} products
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(cat);
                  setForm({
                    name: cat.name,
                    slug: cat.slug,
                    image: cat.image || "",
                  });
                  setModalOpen(true);
                }}
                className="text-gold p-2"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteId(cat.id)}
                className="text-red-400 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-3">
          {[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "image", label: "Category image filename (e.g. category.jpg)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm text-cream/70">{label}</label>
              <input
                value={form[key as keyof typeof form]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                placeholder={
                  key === "image" ? "category.jpg" : undefined
                }
                className="w-full mt-1 px-3 py-2 bg-navy border border-gold/20 rounded text-cream text-sm"
              />
            </div>
          ))}
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Category"
      >
        <p className="text-cream/70 mb-4">Delete this category?</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
