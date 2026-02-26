"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPizza, PizzaCategory } from "@/lib/api/pizza";

type CreateForm = {
  name: string;
  description: string;
  price: string;
  category: Exclude<PizzaCategory, "All">;
  imageFile: File | null;
};

export default function AdminCreatePizzaPage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateForm>({
    name: "",
    description: "",
    price: "",
    category: "Veg",
    imageFile: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const previewUrl = useMemo(() => {
    if (!form.imageFile) return "";
    return URL.createObjectURL(form.imageFile);
  }, [form.imageFile]);

  const onChange = (key: keyof CreateForm, value: any) => {
    setMsg(null);
    setIsError(false);
    setForm((p) => ({ ...p, [key]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.price.trim()) return "Price is required";

    const n = Number(form.price);
    if (Number.isNaN(n) || n <= 0) return "Price must be a valid number";
    if (!form.imageFile) return "Pizza image is required";

    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      setIsError(true);
      setMsg(err);
      return;
    }

    try {
      setSubmitting(true);
      setMsg(null);
      setIsError(false);

      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append("price", form.price.trim());
      fd.append("category", form.category);
      fd.append("image", form.imageFile as File); // MUST be "image"

      await createPizza(fd);

      // ✅ redirect back to admin pizzas list with toast flag
      router.push("/admin/pizzas?created=1");
    } catch (e: any) {
      setIsError(true);
      setMsg(
        e?.response?.data?.message || e?.message || "Failed to create pizza"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-w-0">
      {/* Top */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-orange-800">Add Pizza</h1>
          <p className="mt-1 text-sm text-orange-900/60">
            Fill details and preview how it will look.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/pizzas"
            className="rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-800 hover:bg-orange-50"
          >
            ← Back
          </Link>

          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-full bg-orange-600 px-6 py-2 text-sm font-extrabold text-white hover:opacity-90 disabled:opacity-60"
            type="button"
          >
            {submitting ? "Creating..." : "Create Pizza"}
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={[
            "mt-6 rounded-2xl px-4 py-3 text-sm font-semibold",
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
          ].join(" ")}
        >
          {msg}
        </div>
      )}

      {/* Body */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-7 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-orange-800">
            Pizza Details
          </h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Name"
              value={form.name}
              placeholder="e.g. Margherita"
              onChange={(v) => onChange("name", v)}
            />

            <Field
              label="Price"
              value={form.price}
              placeholder="e.g. 299"
              onChange={(v) => onChange("price", v)}
              type="number"
            />

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-orange-900/80">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => onChange("category", e.target.value)}
                className="h-12 rounded-2xl border border-orange-200 bg-orange-50/40 px-4 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
              <p className="text-xs text-orange-900/60">
                “All” is only for filtering — don’t save it as a pizza category.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-orange-900/80">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Short description..."
                className="min-h-[120px] rounded-2xl border border-orange-200 bg-orange-50/40 px-4 py-3 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-orange-900/80">
                Image (required)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  onChange("imageFile", e.target.files?.[0] || null)
                }
                className="block w-full text-sm text-orange-900/70 file:mr-4 file:rounded-full file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:opacity-90"
              />

              <p className="text-xs text-orange-900/60">
                Upload an image (max 5MB). Field name must be{" "}
                <span className="font-mono">image</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-orange-800">
              Live Preview
            </h2>
            <p className="mt-1 text-sm text-orange-900/60">
              This is how the pizza card will look.
            </p>

            <div className="mt-6 flex justify-center">
              <PreviewCard
                name={form.name || "Pizza Name"}
                description={
                  form.description || "Pizza description will appear here."
                }
                price={form.price || "0"}
                category={form.category}
                previewUrl={previewUrl}
              />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <p className="text-sm font-bold text-orange-800">Tip</p>
            <p className="mt-1 text-xs text-orange-900/60">
              Keep descriptions 1–2 lines for perfect card alignment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-orange-900/80">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="h-12 rounded-2xl border border-orange-200 bg-orange-50/40 px-4 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
      />
    </div>
  );
}

function PreviewCard({
  name,
  description,
  price,
  category,
  previewUrl,
}: {
  name: string;
  description: string;
  price: string;
  category: "Veg" | "Non-Veg";
  previewUrl: string;
}) {
  return (
    <div className="bg-white w-[250px] rounded-2xl border border-orange-100 shadow-sm p-5 flex flex-col items-center text-center">
      <div className="w-full flex items-center justify-between">
        <span
          className={[
            "text-[11px] font-bold px-2 py-1 rounded-full",
            category === "Veg"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700",
          ].join(" ")}
        >
          {category}
        </span>

        <span className="text-orange-300" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current">
            <path d="M6 6h15l-2 9H7L6 6Z" strokeWidth="2" strokeLinejoin="round" />
            <path d="M6 6 5 3H2" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="21" r="1" strokeWidth="2" />
            <circle cx="18" cy="21" r="1" strokeWidth="2" />
          </svg>
        </span>
      </div>

      <div className="mt-4 h-24 w-24 rounded-full overflow-hidden bg-orange-50 flex items-center justify-center">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-xs text-orange-900/40">No image</div>
        )}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-orange-950">{name}</h3>
      <p className="mt-2 text-xs text-orange-900/60 line-clamp-2 min-h-[32px]">
        {description}
      </p>

      <div className="mt-4 w-full flex items-center justify-between">
        <p className="text-sm font-semibold text-orange-950">₹ {price}</p>
        <button className="text-xs bg-orange-500 text-white px-4 py-2 rounded-full" type="button">
          Order Now
        </button>
      </div>
    </div>
  );
}
