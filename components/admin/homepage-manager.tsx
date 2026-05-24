"use client";

import { useState } from "react";
import {
  createHomepageSection,
  updateHomepageSection,
  deleteHomepageSection,
  reorderHomepageSections,
} from "@/actions/homepage.actions";
import { ImageUpload } from "./image-upload";
import { Plus, Trash2, Eye, EyeOff, LayoutTemplate, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";

// Section Types Definition
const SECTION_TYPES = [
  { id: "hero_banner", label: "Hero Banner Slider" },
  { id: "category_grid", label: "Category Grid" },
  { id: "product_grid", label: "Product Grid (New Arrivals)" },
  { id: "collection_showcase", label: "Collections Showcase" },
  { id: "testimonials", label: "Testimonials" },
  { id: "custom_html", label: "Custom HTML Block" },
];

export function HomepageManager({
  initialSections,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialSections: any[];
}) {
  const [sections, setSections] = useState(initialSections);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedType, setSelectedType] = useState("hero_banner");

  // Reorder Handler
  const handleReorder = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update Sort Orders sequentially
    const updatedSections = newSections.map((s, i) => ({ ...s, sortOrder: i }));
    setSections(updatedSections);

    const updates = updatedSections.map((s) => ({ id: s.id, sortOrder: s.sortOrder }));
    await reorderHomepageSections(updates);
  };

  return (
    <div className="space-y-6">
      {!showCreate && (
        <div className="flex gap-2">
          <select
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm flex-1 outline-none focus:border-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        </div>
      )}

      {showCreate && (
        <SectionForm
          type={selectedType}
          onCancel={() => setShowCreate(false)}
          onSubmit={async (data) => {
            const res = await createHomepageSection({
              ...data,
              type: selectedType,
              sortOrder: sections.length,
            });
            if (res.success) {
              setSections([...sections, res.section]);
              setShowCreate(false);
            } else alert(res.error || "Error");
          }}
        />
      )}

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all"
          >
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleReorder(index, "up")}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 rounded hover:bg-gray-100"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleReorder(index, "down")}
                disabled={index === sections.length - 1}
                className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 rounded hover:bg-gray-100"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>

            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              {section.content?.image ? (
                <Image
                  src={section.content.image}
                  alt={section.title || "Section"}
                  fill
                  className="object-cover"
                />
              ) : (
                <LayoutTemplate className="h-6 w-6 text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <span className="inline-block px-2 py-0.5 bg-gray-100 border text-[10px] uppercase tracking-wider font-bold text-gray-600 rounded mb-1.5">
                {SECTION_TYPES.find((t) => t.id === section.type)?.label || section.type}
              </span>
              <h3 className="font-bold text-gray-900 leading-tight">
                {section.title || "Untitled Section"}
              </h3>
              {section.subtitle && (
                <p className="text-sm text-gray-500 mt-0.5">{section.subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const res = await updateHomepageSection(section.id, {
                    isActive: !section.isActive,
                  });
                  if (res.success) {
                    setSections(
                      sections.map((s) =>
                        s.id === section.id ? { ...s, isActive: !s.isActive } : s
                      )
                    );
                  }
                }}
                className={`rounded-lg p-2 transition-colors ${section.isActive ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-gray-400 bg-gray-50 hover:bg-gray-100"}`}
                title={section.isActive ? "Hide Section" : "Show Section"}
              >
                {section.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>

              <button
                onClick={async () => {
                  if (!confirm("Delete this section permanently?")) return;
                  const res = await deleteHomepageSection(section.id);
                  if (res.success) {
                    setSections(sections.filter((s) => s.id !== section.id));
                  }
                }}
                className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                title="Delete Section"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No sections added yet. Add a Hero Banner to start!
          </div>
        )}
      </div>
    </div>
  );
}

function SectionForm({
  type,
  onSubmit,
  onCancel,
}: {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: { title: string; subtitle: string; content: any }) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [html, setHtml] = useState("");
  const [saving, setSaving] = useState(false);

  const isHero = type === "hero_banner";
  const isCustomHtml = type === "custom_html";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
      <h3 className="mb-4 text-lg font-bold">
        New {SECTION_TYPES.find((t) => t.id === type)?.label}
      </h3>
      <div className="space-y-4">
        {isHero && (
          <ImageUpload
            images={image ? [image] : []}
            onChange={(imgs) => setImage(imgs[0] || "")}
            single
            folder="banners"
            label="Background Image (16:9 or similar recommended)"
            aspectRatio="aspect-[21/9]"
          />
        )}

        {!isCustomHtml && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder={isHero ? "Ex: ATELIER OF MODEST GRACE" : "Ex: New Arrivals"}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Sub-headline</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="Optional text below headline"
              />
            </div>
          </div>
        )}

        {isHero && (
          <div>
            <label className="text-xs font-medium text-gray-700">Button Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              placeholder="/collections/borka"
            />
          </div>
        )}

        {isCustomHtml && (
          <div>
            <label className="text-xs font-medium text-gray-700">Custom HTML Code</label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 text-sm font-mono"
              rows={6}
              placeholder="<div class='bg-red-500 text-white p-4 text-center'>Special Eid Sale!</div>"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setSaving(true);
              const content = isHero ? { image, link } : isCustomHtml ? { html } : {};
              await onSubmit({ title, subtitle, content });
              setSaving(false);
            }}
            disabled={saving || (isHero && !image) || (isCustomHtml && !html)}
            className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Section"}
          </button>
        </div>
      </div>
    </div>
  );
}
