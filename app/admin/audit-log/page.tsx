/**
 * BIBAZ — Admin Audit Log Page
 * SOP §৪F — Every admin action logged
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminAuditLogPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      admin: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-sm text-gray-500">Complete activity history of all admin actions</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
              <th className="px-6 py-3">Admin</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Entity</th>
              <th className="px-6 py-3">IP</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                  No audit logs yet
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{log.admin.name}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {log.entity} ({log.entityId.slice(0, 8)}...)
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{log.ip || "—"}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString("en-BD")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
