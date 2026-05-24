/**
 * BIBAZ — Admin Homepage Builder
 * Drag, edit, reorder homepage sections
 */

import { getAdminHomepageSections } from "@/actions/homepage.actions";
import { HomepageBuilder } from "@/components/admin/homepage-builder";
import { Layout } from "lucide-react";

export default async function AdminHomepagePage() {
  const result = await getAdminHomepageSections();
  const sections = result.sections || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Layout className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Homepage Builder</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Manage hero banners, sections, and layout
            </p>
          </div>
        </div>
      </div>

      <HomepageBuilder initialSections={sections} />
    </div>
  );
}
