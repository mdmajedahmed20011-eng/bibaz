"use client";

/**
 * BIBAZ — Settings Manager (Tabbed, Editable)
 * Groups: Store Info, Shipping, Social, Branding, SEO
 */

import { useState } from "react";
import { bulkUpdateSettings } from "@/actions/settings.actions";
import { ImageUpload } from "./image-upload";
import { Save, Store, Truck, Share2, Image as ImageIcon, Search, CheckCircle2 } from "lucide-react";
import { BUSINESS, DELIVERY_CHARGE } from "@/lib/constants";

interface Setting {
  key: string;
  value: unknown;
  group: string;
  label: string | null;
  type: string;
}

interface SettingsManagerProps {
  initialSettings: Setting[];
}

const TABS = [
  { id: "general", label: "Store Info", icon: Store },
  { id: "branding", label: "Branding", icon: ImageIcon },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "seo", label: "SEO", icon: Search },
];

// Default settings with fallbacks
const DEFAULTS: Record<string, { value: unknown; group: string; label: string; type: string }> = {
  // General
  store_name: { value: BUSINESS.NAME, group: "general", label: "Store Name", type: "text" },
  store_email: { value: BUSINESS.EMAIL, group: "general", label: "Contact Email", type: "text" },
  store_phone: { value: BUSINESS.PHONE, group: "general", label: "Contact Phone", type: "text" },
  store_address: {
    value: BUSINESS.ADDRESS,
    group: "general",
    label: "Store Address",
    type: "textarea",
  },
  store_tagline: {
    value: "Premium Women's Fashion",
    group: "general",
    label: "Tagline",
    type: "text",
  },

  // Branding
  store_logo: { value: "", group: "branding", label: "Store Logo", type: "image" },
  store_favicon: { value: "", group: "branding", label: "Favicon", type: "image" },

  // Shipping
  shipping_dhaka: {
    value: DELIVERY_CHARGE.DHAKA_INSIDE,
    group: "shipping",
    label: "Dhaka Inside (৳)",
    type: "number",
  },
  shipping_outside: {
    value: DELIVERY_CHARGE.OUTSIDE_DHAKA,
    group: "shipping",
    label: "Outside Dhaka (৳)",
    type: "number",
  },
  free_shipping_threshold: {
    value: 0,
    group: "shipping",
    label: "Free Shipping Above (৳, 0 = disabled)",
    type: "number",
  },

  // Social
  social_facebook: {
    value: BUSINESS.FACEBOOK,
    group: "social",
    label: "Facebook URL",
    type: "text",
  },
  social_instagram: {
    value: BUSINESS.INSTAGRAM,
    group: "social",
    label: "Instagram URL",
    type: "text",
  },
  social_youtube: { value: "", group: "social", label: "YouTube URL", type: "text" },
  social_tiktok: { value: "", group: "social", label: "TikTok URL", type: "text" },

  // SEO
  seo_title: {
    value: "BIBAZ — Premium Women's Fashion",
    group: "seo",
    label: "Default SEO Title",
    type: "text",
  },
  seo_description: {
    value: "Discover premium women's fashion at BIBAZ — sarees, abayas, three-piece sets and more.",
    group: "seo",
    label: "SEO Description",
    type: "textarea",
  },
  seo_keywords: {
    value: "fashion, saree, abaya, three-piece, bangladesh",
    group: "seo",
    label: "SEO Keywords (comma separated)",
    type: "text",
  },
};

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    // Lazy init from DB or defaults
    const initial: Record<string, unknown> = {};
    for (const [key, def] of Object.entries(DEFAULTS)) {
      const dbSetting = initialSettings.find((s) => s.key === key);
      initial[key] = dbSetting?.value !== undefined ? dbSetting.value : def.value;
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const setValue = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSave() {
    setSaving(true);
    const updates = Object.entries(values).map(([key, value]) => {
      const def = DEFAULTS[key]!;
      return {
        key,
        value,
        group: def.group,
        label: def.label,
        type: def.type,
      };
    });

    const result = await bulkUpdateSettings(updates);
    setSaving(false);

    if (result.success) {
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } else {
      alert(result.error || "Failed to save");
    }
  }

  const tabSettings = Object.entries(DEFAULTS).filter(([, def]) => def.group === activeTab);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
              activeTab === tab.id ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="space-y-5">
          {tabSettings.map(([key, def]) => (
            <SettingField
              key={key}
              settingKey={key}
              def={def}
              value={values[key]}
              onChange={(val) => setValue(key, val)}
            />
          ))}
        </div>
      </div>

      {/* Save Bar */}
      <div className="sticky bottom-0 flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur lg:bottom-6">
        {savedMsg && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Settings saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Setting Field
// ═══════════════════════════════════════════

function SettingField({
  settingKey,
  def,
  value,
  onChange,
}: {
  settingKey: string;
  def: { type: string; label: string };
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  return (
    <div>
      <label htmlFor={settingKey} className="mb-1.5 block text-xs font-semibold text-gray-700">
        {def.label}
      </label>

      {def.type === "text" && (
        <input
          id={settingKey}
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      )}

      {def.type === "textarea" && (
        <textarea
          id={settingKey}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      )}

      {def.type === "number" && (
        <input
          id={settingKey}
          type="number"
          value={(value as number) || 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      )}

      {def.type === "image" && (
        <ImageUpload
          images={value ? [value as string] : []}
          onChange={(imgs) => onChange(imgs[0] || "")}
          single
          folder="branding"
          label=""
          aspectRatio="aspect-square"
        />
      )}

      {def.type === "boolean" && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Enabled</span>
        </label>
      )}
    </div>
  );
}
