"use client";

import { useState } from "react";
import { createCampaign, updateCampaign, deleteCampaign } from "@/actions/campaign.actions";
import { Plus, Edit2, Trash2, Calendar, Percent, ToggleLeft, ToggleRight, X } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CampaignManager({ initialCampaigns }: { initialCampaigns: any[] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    discountType: "percentage",
    discountValue: 0,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingCampaign(null);
    setFormData({
      name: "",
      description: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
      discountType: "percentage",
      discountValue: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (campaign: any) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || "",
      startDate: new Date(campaign.startDate).toISOString().slice(0, 16),
      endDate: new Date(campaign.endDate).toISOString().slice(0, 16),
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      isActive: campaign.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      const res = await deleteCampaign(id);
      if (res.success) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete campaign.");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    let res;
    if (editingCampaign) {
      res = await updateCampaign(editingCampaign.id, formData);
    } else {
      res = await createCampaign(formData);
    }

    setSaving(false);
    if (res.success) {
      setIsModalOpen(false);
      window.location.reload(); // Refresh to get updated list
    } else {
      alert(res.error || "Failed to save campaign");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <h3 className="text-sm font-medium text-gray-900">No campaigns yet</h3>
            <p className="mt-1 text-sm text-gray-500">Create a flash sale to boost your sales.</p>
          </div>
        ) : (
          campaigns.map((campaign) => {
            const now = new Date();
            const start = new Date(campaign.startDate);
            const end = new Date(campaign.endDate);
            let status = "Inactive";
            let statusColor = "bg-gray-100 text-gray-700";

            if (campaign.isActive) {
              if (now < start) {
                status = "Scheduled";
                statusColor = "bg-blue-100 text-blue-700";
              } else if (now > end) {
                status = "Expired";
                statusColor = "bg-red-100 text-red-700";
              } else {
                status = "Active";
                statusColor = "bg-green-100 text-green-700";
              }
            }

            return (
              <div
                key={campaign.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}
                    >
                      {status}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleOpenEdit(campaign)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{campaign.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {campaign.description || "No description provided."}
                  </p>
                </div>
                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                      {end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-purple-600">
                      {campaign.discountType === "percentage" ? "" : "৳"}
                      {campaign.discountValue}
                      {campaign.discountType === "percentage" ? "%" : ""} Off
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCampaign ? "Edit Campaign" : "Create Campaign"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Campaign Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="e.g. Eid Mega Sale"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Discount Value</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Campaign Status</p>
                  <p className="text-xs text-gray-500">Enable or disable this campaign</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`${formData.isActive ? "text-purple-600" : "text-gray-400"}`}
                >
                  {formData.isActive ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.startDate || !formData.endDate}
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
