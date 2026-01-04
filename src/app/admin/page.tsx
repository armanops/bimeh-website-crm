"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  UserPlus,
  Send,
  Activity,
  Package,
  Users2,
  FileText,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import BIDashboard from "@/components/admin/bi-dashboard";

interface DashboardMetrics {
  totalCustomers: number;
  totalLeads: number;
  totalMessagesSent: number;
  messagesSentToday: number;
  newCustomersToday: number;
  newLeadsToday: number;
  activeCustomers: number;
  totalProducts: number;
  totalGroups: number;
  totalMessageTemplates: number;
  latestCustomer: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
  } | null;
  lastActivity: {
    id: number;
    sentAt: string | null;
    channel: string;
    customer: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  } | null;
}

interface DistributionItem {
  status?: string;
  channel?: string;
  count: number;
}

export default function AdminPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [customerStatusDist, setCustomerStatusDist] = useState<
    DistributionItem[]
  >([]);
  const [messageChannelDist, setMessageChannelDist] = useState<
    DistributionItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          metricsResponse,
          customerStatusResponse,
          messageChannelResponse,
        ] = await Promise.all([
          fetch("/api/admin/dashboard"),
          fetch("/api/admin/dashboard/customer-status"),
          fetch("/api/admin/dashboard/message-channels"),
        ]);

        if (
          !metricsResponse.ok ||
          !customerStatusResponse.ok ||
          !messageChannelResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [metricsData, customerStatusData, messageChannelData] =
          await Promise.all([
            metricsResponse.json(),
            customerStatusResponse.json(),
            messageChannelResponse.json(),
          ]);

        setMetrics(metricsData);
        setCustomerStatusDist(customerStatusData);
        setMessageChannelDist(messageChannelData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("خطا در بارگذاری داده‌های داشبورد");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: string | Date | null) => {
    if (!date) return "نامشخص";
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return "0";
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">داشبورد مدیریت</h1>
          <p className="text-muted-foreground">
            به پنل مدیریت BIM760 خوش آمدید
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">داشبورد مدیریت</h1>
        <p className="text-red-500">خطا در بارگذاری داده‌ها</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">داشبورد مدیریت</h1>
        <p className="text-muted-foreground">
          نمای کلی از فعالیت‌های سیستم بیمه‌ای BIM760
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل مشتریان</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalCustomers)}
            </div>
            <p className="text-xs text-muted-foreground">
              مشتریان فعال: {formatNumber(metrics.activeCustomers)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل لیدها</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalLeads)}
            </div>
            <p className="text-xs text-muted-foreground">
              امروز: +{formatNumber(metrics.newLeadsToday)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              پیام‌های ارسال شده
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalMessagesSent)}
            </div>
            <p className="text-xs text-muted-foreground">
              امروز: {formatNumber(metrics.messagesSentToday)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محصولات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalProducts)}
            </div>
            <p className="text-xs text-muted-foreground">فعال در سیستم</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              گروه‌های پیام‌رسانی
            </CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalGroups)}
            </div>
            <p className="text-xs text-muted-foreground">گروه‌های فعال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قالب‌های پیام</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalMessageTemplates)}
            </div>
            <p className="text-xs text-muted-foreground">قالب‌های آماده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              مشتریان جدید امروز
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.newCustomersToday)}
            </div>
            <p className="text-xs text-muted-foreground">ثبت شده امروز</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Activity and Customer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              آخرین فعالیت
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.lastActivity ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {metrics.lastActivity.customer?.firstName}{" "}
                    {metrics.lastActivity.customer?.lastName}
                  </span>
                  <Badge variant="outline">
                    {metrics.lastActivity.channel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(metrics.lastActivity.sentAt)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">فعالیتی یافت نشد</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              آخرین مشتری
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.latestCustomer ? (
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  {metrics.latestCustomer.firstName || ""}{" "}
                  {metrics.latestCustomer.lastName || ""}
                </div>
                <p className="text-xs text-muted-foreground">
                  ثبت شده در: {formatDate(metrics.latestCustomer.createdAt)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">مشتری یافت نشد</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>توزیع وضعیت مشتریان</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerStatusDist.map((item, index) => {
                const total = customerStatusDist.reduce(
                  (sum, d) => sum + d.count,
                  0
                );
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.status}</span>
                      <span>
                        {formatNumber(item.count)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزیع کانال‌های پیام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messageChannelDist.map((item, index) => {
                const total = messageChannelDist.reduce(
                  (sum, d) => sum + d.count,
                  0
                );
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.channel}</span>
                      <span>
                        {formatNumber(item.count)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BI Dashboard Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              داشبورد تحلیلی (BI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BIDashboard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
