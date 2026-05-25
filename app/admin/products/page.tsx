"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import {
  resolveProductImageSrc,
  toDisplayFilename,
  toLocalImagePath,
} from "@/lib/images";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  status: string;
  images: string[];
  categoryId: string;
  category?: { name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const emptyForm = {
  name: "",
  description: "",
  slug: "",
  price: "",
  discount: "0",
  brand: "Yzak",
  stock: "10",
  categoryId: "",
  sizes: "S,M,L,XL",
  colors: "Gold,Black",
  images: "",
  featured: false,
  status: "ACTIVE",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getCategorySlug = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.slug ?? "gold";

  const load = () => {
    fetch("/api/products?admin=true")
      .then((r) => r.json())
      .then(setProducts);
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    const categorySlug = p.category?.slug ?? getCategorySlug(p.categoryId);
    setEditing(p);
    setForm({
      name: p.name,
      description: "",
      slug: p.slug,
      price: String(p.price),
      discount: "0",
      brand: "Yzak",
      stock: String(p.stock),
      categoryId: p.categoryId,
      sizes: "S,M,L,XL",
      colors: "Gold,Black",
      images: p.images
        .map((img) => toDisplayFilename(img, categorySlug))
        .join(", "),
      featured: false,
      status: p.status,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);
    const categorySlug = getCategorySlug(form.categoryId);
    const imageFilenames = form.images
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    const images = imageFilenames.map((f) =>
      toLocalImagePath(categorySlug, f)
    );

    const payload = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name,
      description: form.description || `${form.name} - Yzak Luxury Brand`,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      price: form.price,
      discount: form.discount,
      brand: form.brand,
      stock: form.stock,
      categoryId: form.categoryId,
      sizes: form.sizes.split(",").map((s) => s.trim()),
      colors: form.colors.split(",").map((c) => c.trim()),
      images,
      featured: form.featured,
      status: form.status,
    };

    const res = await fetch("/api/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editing ? "Product updated" : "Product created");
      setModalOpen(false);
      load();
    } else {
      toast.error("Failed to save product");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/products?id=${deleteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Product deleted");
      load();
    }
    setDeleteId(null);
  };

  const selectedCategorySlug = form.categoryId
    ? getCategorySlug(form.categoryId)
    : "gold";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-gold">Products</h1>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="overflow-x-auto bg-card rounded-lg border border-gold/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-cream/60 text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const categorySlug =
                p.category?.slug ?? getCategorySlug(p.categoryId);
              const imageSrc = resolveProductImageSrc(
                categorySlug,
                p.images[0]
              );
              return (
                <tr key={p.id} className="border-b border-gold/10">
                  <td className="p-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-navy">
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category?.name || "—"}</td>
                  <td className="p-3 text-gold">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.status}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-gold">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Product" : "Add Product"}
        size="lg"
      >
        <div className="space-y-3">
          {[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "description", label: "Description" },
            { key: "brand", label: "Brand" },
            { key: "price", label: "Price", type: "number" },
            { key: "discount", label: "Discount %", type: "number" },
            { key: "stock", label: "Stock", type: "number" },
            { key: "sizes", label: "Sizes (comma-separated)" },
            { key: "colors", label: "Colors (comma-separated)" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-sm text-cream/70">{label}</label>
              <input
                type={type || "text"}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-navy border border-gold/20 rounded text-cream text-sm"
              />
            </div>
          ))}

          <div>
            <label className="text-sm text-cream/70">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-navy border border-gold/20 rounded text-cream text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-cream/70">
              Image filenames (comma-separated)
            </label>
            <input
              type="text"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="gold-ring.jpg, gold-ring-side.jpg"
              className="w-full mt-1 px-3 py-2 bg-navy border border-gold/20 rounded text-cream text-sm"
            />
            <p className="text-xs text-cream/50 mt-1">
              Place files in{" "}
              <code className="text-gold">
                public/images/{selectedCategorySlug}/
              </code>{" "}
              — displayed as{" "}
              <code className="text-gold">
                /images/{selectedCategorySlug}/filename.jpg
              </code>
            </p>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="accent-gold"
              />
              Featured
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="px-3 py-1 bg-navy border border-gold/20 rounded text-sm text-cream"
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
          <Button onClick={handleSave} loading={loading} className="w-full">
            Save Product
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
      >
        <p className="text-cream/70 mb-4">
          Are you sure you want to delete this product?
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} className="bg-red-600 text-white">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
