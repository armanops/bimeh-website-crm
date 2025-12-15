import Link from "next/link";
import { Upload, Table, Users, History, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Upload Leads", href: "/admin/upload-leads", icon: Upload },
  { name: "Leads Table", href: "/admin/leads-table", icon: Table },
  { name: "Customers Table", href: "/admin/customers-table", icon: Users },
  { name: "Activity History", href: "/admin/activity-history", icon: History },
  { name: "Export Data", href: "/admin/export-data", icon: Download },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white h-full p-4 border-r border-gray-200">
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-black"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
