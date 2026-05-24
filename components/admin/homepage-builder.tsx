"use client";

/**
 * BIBAZ — Homepage Builder Component
 * Add, edit, reorder, delete homepage sections
 */

import { useState } from "react";
import {
  createHomepageSection,
  updateHomepageSection,
  deleteHomepageSection,
  reorderHomepageSections,
} from "@/actions/homepage.actions";
import { ImageUpload } from "./image-upload";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Save,
  Image as ImageIcon,
  Grid3x3,
  Package,
  Sparkles,
  MessageSquare,
  Code,
} from "lucide-react";

interface Section {
  id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  content: unknown;
  sortOrder: number;
  isActive: boolean;
}

interface HomepageBuilderProps {
  initialSections: Section[];
}

const SECTION_TYPES = [
  {
    value: "hero_banner",
    label: "Hero Banner",
    icon: ImageIcon,
    description: "Full-width banner with image, text, CTA",
  },
  {
    value: "category_grid",
    label: "Category Grid",
    icon: Grid3x3,
    description: "Grid showing product categories",
  },
  {
    value: "product_grid",
    label: "Product Grid",
    icon: Package,
    description: "Featured/curated product list",
  },
  {
    value: "collection_showcase",
    label: "Collection Showcase",
    icon: Sparkles,
    description: "Visual collection blocks",
  },
  {
    value: "testimonials",
    label: "Testimonials",
    icon: MessageSquare,
    description: "Customer reviews carousel",
  },
  {
    value: "promo_banner",
    label: "Promo Banner",
    icon: ImageIcon,
    description: "Promotional banner with offer",
  },
  {
    value: "custom_html",
    label: "Custom HTML",
    icon: Code,
    description: "Custom HTML/markup section",
  },
];

export function HomepageBuilder({ initialSections }: HomepageBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  async function handleAdd(type: string) {
    setShowAddMenu(false);
    const result = await createHomepageSection({
      type,
      title: SECTION_TYPES.find((t) => t.value === type)?.label || "New Section",
      content: getDefaultContent(type),
    });

    if (result.success && result.section) {
      setSections([...sections, result.section as Section]);
      setEditingId(result.section.id);
    } else {
      alert(result.error || "Failed to create section");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this section? This cannot be undone.")) return;
    const result = await deleteHomepageSection(id);
    if (result.success) {
      setSections(sections.filter((s) => s.id !== id));
    } else {
      alert(result.error || "Failed to delete");
    }
  }

  async function handleToggleActive(section: Section) {
    const result = await updateHomepageSection(section.id, {
      isActive: !section.isActive,
    });
    if (result.success) {
      setSections(sections.map((s) => (s.id === section.id ? { ...s, isActive: !s.isActive } : s)));
    }
  }

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(fromIndex, 1);
    if (!moved) return;
    updated.splice(toIndex, 0, moved);
    setSections(updated);
    await reorderHomepageSections(updated.map((s) => s.id));
  }

  return (
    <div className="space-y-4">
      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Layout className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-700">No sections yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Add your first section to start building the homepage
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              total={sections.length}
              isEditing={editingId === section.id}
              onEdit={() => setEditingId(editingId === section.id ? null : section.id)}
              onUpdate={(updated) => {
                setSections(sections.map((s) => (s.id === updated.id ? updated : s)));
              }}
              onDelete={() => handleDelete(section.id)}
              onToggleActive={() => handleToggleActive(section)}
              onMoveUp={() => handleReorder(index, index - 1)}
              onMoveDown={() => handleReorder(index, index + 1)}
            />
          ))}
        </div>
      )}

      {/* Add Section Button */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>

        {showAddMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
            <div className="absolute left-0 right-0 top-full z-50 mt-2 grid grid-cols-1 gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl sm:grid-cols-2">
              {SECTION_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleAdd(type.value)}
                  className="flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-blue-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <type.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{type.label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Section Card
// ═══════════════════════════════════════════

function SectionCard({
  section,
  index,
  total,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: {
  section: Section;
  index: number;
  total: number;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (s: Section) => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const typeMeta = SECTION_TYPES.find((t) => t.value === section.type);
  const Icon = typeMeta?.icon || Layout;

  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm transition-all ${
        section.isActive ? "border-gray-200" : "border-gray-200 opacity-60"
      } ${isEditing ? "ring-2 ring-blue-500/20" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {section.title || typeMeta?.label}
            </p>
            <p className="text-xs text-gray-500">{typeMeta?.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Reorder */}
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Toggle visibility */}
          <button
            onClick={onToggleActive}
            className={`rounded p-1.5 ${section.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
            title={section.isActive ? "Hide section" : "Show section"}
          >
            {section.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>

          {/* Edit */}
          <button
            onClick={onEdit}
            className={`rounded px-3 py-1 text-xs font-medium ${
              isEditing ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {isEditing ? "Close" : "Edit"}
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="rounded p-1.5 text-red-500 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      {isEditing && <SectionEditor section={section} onUpdate={onUpdate} />}
    </div>
  );
}

// ═══════════════════════════════════════════
// Section Editor (per-type)
// ═══════════════════════════════════════════

function SectionEditor({
  section,
  onUpdate,
}: {
  section: Section;
  onUpdate: (s: Section) => void;
}) {
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any>(section.content || {});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await updateHomepageSection(section.id, {
      title,
      subtitle,
      content,
    });
    setSaving(false);

    if (result.success) {
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2000);
      onUpdate({ ...section, title, subtitle, content });
    } else {
      alert(result.error || "Failed to save");
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Title & Subtitle */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            placeholder="Section title"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            placeholder="Optional subtitle"
          />
        </div>
      </div>

      {/* Type-specific content editor */}
      {section.type === "hero_banner" && (
        <HeroBannerEditor content={content} onChange={setContent} />
      )}
      {section.type === "promo_banner" && (
        <PromoBannerEditor content={content} onChange={setContent} />
      )}
      {section.type === "custom_html" && (
        <CustomHtmlEditor content={content} onChange={setContent} />
      )}
      {(section.type === "category_grid" ||
        section.type === "product_grid" ||
        section.type === "collection_showcase" ||
        section.type === "testimonials") && (
        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
          This section auto-loads data from your store. Title and subtitle above will be displayed.
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
        {savedMsg && <span className="text-xs font-medium text-green-600">✓ Saved</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Type-specific editors
// ═══════════════════════════════════════════

function HeroBannerEditor({
  content,
  onChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (c: any) => void;
}) {
  const slides = content.slides || [];

  function addSlide() {
    onChange({
      ...content,
      slides: [
        ...slides,
        { image: "", title: "", subtitle: "", overline: "", link: "/collections" },
      ],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateSlide(i: number, data: any) {
    const updated = [...slides];
    updated[i] = { ...updated[i], ...data };
    onChange({ ...content, slides: updated });
  }

  function removeSlide(i: number) {
    onChange({ ...content, slides: slides.filter((_: unknown, idx: number) => idx !== i) });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-gray-700">Banner Slides</p>
      {slides.map(
        (
          slide: {
            image?: string;
            title?: string;
            subtitle?: string;
            overline?: string;
            link?: string;
          },
          i: number
        ) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Slide {i + 1}</span>
              <button
                onClick={() => removeSlide(i)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="space-y-3">
              <ImageUpload
                images={slide.image ? [slide.image] : []}
                onChange={(imgs) => updateSlide(i, { image: imgs[0] || "" })}
                single
                folder="banners"
                label="Banner Image"
                aspectRatio="aspect-[16/9]"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={slide.overline || ""}
                  onChange={(e) => updateSlide(i, { overline: e.target.value })}
                  className="rounded border border-gray-200 px-2 py-1.5 text-xs"
                  placeholder="Overline (e.g., NEW SEASON)"
                />
                <input
                  type="text"
                  value={slide.link || ""}
                  onChange={(e) => updateSlide(i, { link: e.target.value })}
                  className="rounded border border-gray-200 px-2 py-1.5 text-xs"
                  placeholder="Link (e.g., /collections/saree)"
                />
              </div>
              <input
                type="text"
                value={slide.title || ""}
                onChange={(e) => updateSlide(i, { title: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
                placeholder="Title"
              />
              <textarea
                value={slide.subtitle || ""}
                onChange={(e) => updateSlide(i, { subtitle: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
                placeholder="Subtitle"
                rows={2}
              />
            </div>
          </div>
        )
      )}
      <button
        onClick={addSlide}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Slide
      </button>
    </div>
  );
}

function PromoBannerEditor({
  content,
  onChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (c: any) => void;
}) {
  return (
    <div className="space-y-3">
      <ImageUpload
        images={content.image ? [content.image] : []}
        onChange={(imgs) => onChange({ ...content, image: imgs[0] || "" })}
        single
        folder="banners"
        label="Promo Image"
        aspectRatio="aspect-[16/9]"
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={content.ctaText || ""}
          onChange={(e) => onChange({ ...content, ctaText: e.target.value })}
          className="rounded border border-gray-200 px-2 py-1.5 text-xs"
          placeholder="Button text (e.g., Shop Now)"
        />
        <input
          type="text"
          value={content.link || ""}
          onChange={(e) => onChange({ ...content, link: e.target.value })}
          className="rounded border border-gray-200 px-2 py-1.5 text-xs"
          placeholder="Button link"
        />
      </div>
    </div>
  );
}

function CustomHtmlEditor({
  content,
  onChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (c: any) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-700">HTML Content</label>
      <textarea
        value={content.html || ""}
        onChange={(e) => onChange({ ...content, html: e.target.value })}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs"
        rows={8}
        placeholder="<div>Custom HTML here...</div>"
      />
      <p className="mt-1 text-xs text-amber-600">
        ⚠ Be careful with custom HTML — only use trusted code
      </p>
    </div>
  );
}

// Default content per section type
function getDefaultContent(type: string): object {
  switch (type) {
    case "hero_banner":
      return { slides: [] };
    case "promo_banner":
      return { image: "", ctaText: "Shop Now", link: "/collections" };
    case "custom_html":
      return { html: "" };
    default:
      return {};
  }
}

// Lucide layout icon (used as fallback)
function Layout({ className }: { className?: string }) {
  return <ImageIcon className={className} />;
}
