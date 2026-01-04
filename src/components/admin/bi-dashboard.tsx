"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  BarChart3,
  TrendingUp,
  Calendar,
  UserPlus,
  Send,
  Activity,
  Users2,
} from "lucide-react";
import { toast } from "sonner";

interface BIDashboardProps {
  className?: string;
}

// Type definitions for BI data
interface LeadSourceDistribution {
  source: string | null;
  count: number;
  percentage: number;
}

interface CustomerStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

interface LeadStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export default function BIDashboard({ className }: BIDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // State for BI data
  const [leadSources, setLeadSources] = useState<LeadSourceDistribution[]>([]);
  const [customerStatus, setCustomerStatus] = useState<
    CustomerStatusDistribution[]
  >([]);
  const [leadStatus, setLeadStatus] = useState<LeadStatusDistribution[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadSourcesRes, customerStatusRes, leadStatusRes] =
          await Promise.all([
            fetch("/api/admin/dashboard/lead-sources"),
            fetch("/api/admin/dashboard/customer-status"),
            fetch("/api/admin/dashboard/lead-status"),
          ]);

        if (!leadSourcesRes.ok || !customerStatusRes.ok || !leadStatusRes.ok) {
          throw new Error("Failed to fetch BI data");
        }

        const [leadSourcesData, customerStatusData, leadStatusData] =
          await Promise.all([
            leadSourcesRes.json(),
            customerStatusRes.json(),
            leadStatusRes.json(),
          ]);

        setLeadSources(leadSourcesData);
        setCustomerStatus(customerStatusData);
        setLeadStatus(leadStatusData);
      } catch (error) {
        console.error("Error fetching BI data:", error);
        toast.error("خطا در بارگذاری داده‌های تحلیلی");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number | string | null | undefined) => {
    if (num == null) return "0";
    const numericValue = typeof num === "string" ? parseInt(num, 10) : num;
    if (isNaN(numericValue)) return "0";
    return new Intl.NumberFormat("fa-IR").format(numericValue);
  };

  const formatPercentage = (num: number | string | null | undefined) => {
    if (num == null) return "0%";
    const numericValue = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(numericValue)) return "0%";
    return `${numericValue.toFixed(1)}%`;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: "جدید",
      contacted: "تماس گرفته شده",
      target: "هدف",
      active: "فعال",
      deactivated: "غیرفعال",
      lead: "لید",
    };
    return labels[status] || status;
  };

  const getSourceLabel = (source: string | null) => {
    if (!source) return "ناشناخته";
    return source;
  };

  const tabs = [
    {
      id: "overview",
      label: "مرور کلی",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    { id: "leads", label: "لیدها", icon: <Users className="h-4 w-4" /> },
    { id: "customers", label: "مشتریان", icon: <Users2 className="h-4 w-4" /> },
  ];

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div>
          <h2 className="text-xl font-bold mb-4">داشبورد تحلیلی (BI)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-xl font-bold mb-4">داشبورد تحلیلی (BI)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Total Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                کل لیدها
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-primary">
                {formatNumber(
                  leadStatus.reduce((sum, item) => sum + item.count, 0)
                )}
              </div>
              <div className="space-y-2">
                {leadStatus.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {getStatusLabel(item.status)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatNumber(item.count)}
                      </span>
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Total Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5" />
                کل مشتریان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-primary">
                {formatNumber(
                  customerStatus.reduce((sum, item) => sum + item.count, 0)
                )}
              </div>
              <div className="space-y-2">
                {customerStatus.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {getStatusLabel(item.status)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatNumber(item.count)}
                      </span>
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                منابع لید
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leadSources.slice(0, 5).map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {getSourceLabel(source.source)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(source.count)} لید
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPercentage(source.percentage)}
                      </div>
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === "leads" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                توزیع وضعیت لیدها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadStatus.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {getStatusLabel(item.status)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(item.count)} لید
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPercentage(item.percentage)}
                      </div>
                      <div className="w-40 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                منابع لید
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leadSources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {getSourceLabel(source.source)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(source.count)} لید
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPercentage(source.percentage)}
                      </div>
                      <div className="w-40 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5" />
                توزیع وضعیت مشتریان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerStatus.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {getStatusLabel(item.status)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(item.count)} مشتری
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPercentage(item.percentage)}
                      </div>
                      <div className="w-40 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
