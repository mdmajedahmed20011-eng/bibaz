"use client";

/**
 * BIBAZ — Admin Header
 */

import { signOut } from "next-auth/react";
import { LogOut, Bell, User } from "lucide-react";

interface AdminHeaderProps {
  userName: string;
  userRole: string;
}

export function AdminHeader({ userName, userRole }: AdminHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left: Page title area */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>

      {/* Right: User info + actions */}
      <div className="flex items-center gap-4">
        {/* Notifications placeholder */}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
