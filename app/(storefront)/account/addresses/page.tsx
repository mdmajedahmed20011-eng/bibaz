/**
 * BIBAZ — Addresses Page
 * List, add, edit, delete, set default
 * SOP §২ — Frontend Plan F5.8
 */

"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

// Placeholder addresses
const initialAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    name: "Habiba Hafiz",
    phone: "+880 1860-744181",
    street: "House 60, Road 10, Block D",
    area: "Banani",
    city: "Dhaka",
    postalCode: "1216",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    name: "Habiba Hafiz",
    phone: "+880 1860-744181",
    street: "1st Floor, Nest Mega Mall",
    area: "Banani",
    city: "Dhaka",
    postalCode: "1216",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      <Separator />

      {/* Add Address Form (simplified) */}
      {showForm && (
        <div className="p-4 rounded-xl border border-border space-y-4">
          <h3 className="text-sm font-semibold">New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Label (e.g., Home, Office)"
              className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              placeholder="Full Name"
              className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              placeholder="Street Address"
              className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              placeholder="Area"
              className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              placeholder="City"
              className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-3">
            <button className="h-9 px-5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors">
              Save Address
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="h-9 px-5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <MapPin className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative p-4 rounded-xl border transition-colors ${
                address.isDefault ? "border-foreground/30 bg-muted/30" : "border-border"
              }`}
            >
              {address.isDefault && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-foreground text-background px-2 py-0.5 rounded">
                  Default
                </span>
              )}
              <div className="space-y-1">
                <p className="text-sm font-semibold">{address.label}</p>
                <p className="text-sm text-muted-foreground">{address.name}</p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {address.street}, {address.area}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.city} {address.postalCode}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
