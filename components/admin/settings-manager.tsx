"use client";

/**
 * BIBAZ — Settings Manager (Advanced 5x)
 * Groups: Store Info, Branding, Shipping, Taxes, Email, Social, SEO
 */

import { useState } from "react";
import { bulkUpdateSettings } from "@/actions/settings.actions";
import { ImageUpload } from "./image-upload";
import { Save, Store, Truck, Share2, Image as ImageIcon, Search, CheckCircle2, Percent, Mail } from "lucide-react";
import { BUSINESS, DELIVERY_CHARGE } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

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
  { id: "taxes", label: "Taxes", icon: Percent },
  { id: "email", label: "Email Config", icon: Mail },
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
  currency_symbol: { value: "৳", group: "general", label: "Currency Symbol", type: "text" },

  // Branding
  store_logo: { value: "", group: "branding", label: "Store Logo", type: "image" },
  store_favicon: { value: "", group: "branding", label: "Favicon", type: "image" },
  primary_color: { value: "#000000", group: "branding", label: "Primary Brand Color (Hex)", type: "text" },

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
  enable_international_shipping: { value: false, group: "shipping", label: "Enable International Shipping", type: "boolean" },

  // Taxes
  enable_taxes: { value: false, group: "taxes", label: "Enable Tax Calculation", type: "boolean" },
  tax_rate: { value: 0, group: "taxes", label: "Default Tax Rate (%)", type: "number" },
  prices_include_tax: { value: true, group: "taxes", label: "Product Prices Include Tax", type: "boolean" },

  // Email Config
  smtp_host: { value: "", group: "email", label: "SMTP Host", type: "text" },
  smtp_port: { value: 465, group: "email", label: "SMTP Port", type: "number" },
  smtp_user: { value: "", group: "email", label: "SMTP Username", type: "text" },
  smtp_pass: { value: "", group: "email", label: "SMTP Password", type: "text" },
  email_from_name: { value: BUSINESS.NAME, group: "email", label: "Email From Name", type: "text" },

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
    <div className="space-y-6">
      {/* Scrollable Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/20 bg-white/40 p-2 shadow-sm backdrop-blur-md pb-2 custom-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-white" : "text-gray-600 hover:bg-white/50"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-gray-900 shadow-sm"
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Settings Form Container (Glassmorphism) */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-black/[0.03] backdrop-blur-xl sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tabSettings.map(([key, def]) => (
                <div key={key} className={def.type === "textarea" ? "md:col-span-2 lg:col-span-3" : ""}>
                  <SettingField
                    settingKey={key}
                    def={def}
                    value={values[key]}
                    onChange={(val) => setValue(key, val)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 z-50 flex items-center justify-end gap-4 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-2xl backdrop-blur-xl">
        <AnimatePresence>
          {savedMsg && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm font-semibold text-emerald-600"
            >
              <CheckCircle2 className="h-5 w-5" />
              Settings saved!
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={handleSave}
          disabled={saving}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white"
            />
          ) : (
            <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
          )}
          {saving ? "Saving Changes..." : "Save Changes"}
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
    <div className="group">
      <label htmlFor={settingKey} className="mb-2 block text-sm font-semibold text-gray-700 transition-colors group-hover:text-gray-900">
        {def.label}
      </label>

      {def.type === "text" && (
        <input
          id={settingKey}
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border-0 bg-white/50 px-4 py-3 text-sm shadow-inner ring-1 ring-inset ring-gray-200/60 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500"
        />
      )}

      {def.type === "textarea" && (
        <textarea
          id={settingKey}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-xl border-0 bg-white/50 px-4 py-3 text-sm shadow-inner ring-1 ring-inset ring-gray-200/60 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500"
        />
      )}

      {def.type === "number" && (
        <input
          id={settingKey}
          type="number"
          value={(value as number) || 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border-0 bg-white/50 px-4 py-3 text-sm shadow-inner ring-1 ring-inset ring-gray-200/60 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500"
        />
      )}

      {def.type === "image" && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white/40 p-2 transition-colors hover:bg-white/60">
          <ImageUpload
            images={value ? [value as string] : []}
            onChange={(imgs) => onChange(imgs[0] || "")}
            single
            folder="branding"
            label=""
            aspectRatio="aspect-square"
          />
        </div>
      )}

      {def.type === "boolean" && (
        <label className="relative inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <span className="text-sm font-medium text-gray-700">Enabled</span>
        </label>
      )}
    </div>
  );
}

