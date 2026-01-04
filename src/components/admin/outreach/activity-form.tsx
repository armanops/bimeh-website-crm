"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type {
  Activity,
  MessageChannel,
  ActivityStatus,
  OutreachType,
} from "@/db/schema";

interface ActivityFormProps {
  customerId: number;
  activity?: Activity | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ActivityForm({
  customerId,
  activity,
  onSuccess,
  onCancel,
}: ActivityFormProps) {
  const [formData, setFormData] = useState({
    messageText: activity?.messageText || "",
    channel: (activity?.channel as MessageChannel) || "whatsapp",
    outreachType: (activity?.outreachType as OutreachType) || "initial-contact",
    status: (activity?.status as ActivityStatus) || "pending",
    sentBy: activity?.sentBy || "",
    notes: activity?.notes || "",
    isAiGenerated: activity?.isAiGenerated || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = activity
        ? `/api/admin/outreach/activities/${activity.id}`
        : "/api/admin/outreach/activities";
      const method = activity ? "PUT" : "POST";

      const requestData = {
        ...formData,
        customerId,
        sentAt: new Date().toISOString(),
      };

      console.log("Sending request to:", endpoint);
      console.log("Method:", method);
      console.log("Request data:", requestData);

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(
          activity
            ? "ویرایش فعالیت با خطا مواجه شد"
            : "افزودن فعالیت با خطا مواجه شد"
        );
      }

      const result = await response.json();
      console.log("Response data:", result);

      toast.success(
        activity ? "فعالیت با موفقیت ویرایش شد" : "فعالیت با موفقیت اضافه شد"
      );
      onSuccess();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error(
        activity
          ? "ویرایش فعالیت با خطا مواجه شد"
          : "افزودن فعالیت با خطا مواجه شد"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activity) return;

    if (!confirm("آیا مطمئن هستید که می‌خواهید این فعالیت را حذف کنید؟")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/outreach/activities/${activity.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("حذف فعالیت با خطا مواجه شد");
      }

      toast.success("فعالیت با موفقیت حذف شد");
      onSuccess();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("حذف فعالیت با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  const getChannelLabel = (channel: MessageChannel) => {
    const labels: { [key: string]: string } = {
      whatsapp: "واتس‌اپ",
      sms: "پیامک",
      email: "ایمیل",
      telegram: "تلگرام",
      bale: "بله",
      eita: "ایتا",
      instagram: "اینستاگرام",
    };
    return labels[channel] || channel;
  };

  const getOutreachTypeLabel = (type: OutreachType) => {
    const labels: { [key: string]: string } = {
      "initial-contact": "تماس اولیه",
      "follow-up": "پیگیری",
      reminder: "یادآوری",
      promotion: "تبلیغات",
      custom: "سفارشی",
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: ActivityStatus) => {
    const labels: { [key: string]: string } = {
      pending: "در انتظار",
      sent: "ارسال شده",
      failed: "ناموفق",
    };
    return labels[status] || status;
  };

  return (
    <div className="border rounded-lg p-4 space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {activity ? "ویرایش فعالیت" : "افزودن فعالیت جدید"}
        </h3>
        <div className="flex gap-2">
          {activity && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              size="sm"
            >
              حذف
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            size="sm"
          >
            <X className="h-4 w-4 ml-2" />
            انصراف
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="channel">کانال ارتباطی</Label>
            <Select
              value={formData.channel}
              onValueChange={(value) =>
                setFormData({ ...formData, channel: value as MessageChannel })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب کانال" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "whatsapp",
                  "sms",
                  "email",
                  "telegram",
                  "bale",
                  "eita",
                  "instagram",
                ].map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {getChannelLabel(channel as MessageChannel)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outreachType">نوع تماس</Label>
            <Select
              value={formData.outreachType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  outreachType: value as OutreachType,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب نوع تماس" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "initial-contact",
                  "follow-up",
                  "reminder",
                  "promotion",
                  "custom",
                ].map((type) => (
                  <SelectItem key={type} value={type}>
                    {getOutreachTypeLabel(type as OutreachType)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">وضعیت</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as ActivityStatus })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                {["pending", "sent", "failed"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status as ActivityStatus)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sentBy">ارسال شده توسط</Label>
            <Input
              id="sentBy"
              value={formData.sentBy}
              onChange={(e) =>
                setFormData({ ...formData, sentBy: e.target.value })
              }
              placeholder="نام اپراتور"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="messageText">متن پیام</Label>
          <Textarea
            id="messageText"
            value={formData.messageText}
            onChange={(e) =>
              setFormData({ ...formData, messageText: e.target.value })
            }
            placeholder="متن پیام را وارد کنید..."
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">یادداشت</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="یادداشت اختیاری..."
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            id="isAiGenerated"
            checked={formData.isAiGenerated}
            onChange={(e) =>
              setFormData({ ...formData, isAiGenerated: e.target.checked })
            }
          />
          <Label htmlFor="isAiGenerated">
            این پیام توسط هوش مصنوعی تولید شده است
          </Label>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 ml-2" />
            {activity ? "ویرایش فعالیت" : "افزودن فعالیت"}
          </Button>
        </div>
      </form>
    </div>
  );
}
