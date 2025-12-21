"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { Customer as CustomerType } from "@/db/schema";

type Customer = Omit<
  CustomerType,
  "createdAt" | "updatedAt" | "dateOfBirth" | "preferredChannel" | "status"
> & {
  createdAt: string;
  updatedAt: string;
  dateOfBirth: string | null;
  preferredChannel: string;
  status: string;
};

const customerSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  phone: z.string().min(1, "شماره تلفن الزامی است"),
  insuranceType: z.string().optional(),
  preferredChannel: z.enum([
    "whatsapp",
    "sms",
    "email",
    "telegram",
    "bale",
    "eita",
    "instagram",
  ]),
  status: z.enum(["new", "contacted", "target", "active", "deactivated"]),
  nationalId: z.string().optional(),
  birthCertificateNumber: z.string().optional(),
  birthCertificateIssuancePlace: z.string().optional(),
  placeOfBirth: z.string().optional(),
  dateOfBirth: z.string().optional(),
  telegramId: z.string().optional(),
  whatsappId: z.string().optional(),
  eitaId: z.string().optional(),
  baleId: z.string().optional(),
  email: z.string().email("ایمیل نامعتبر است").optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  numberOfChildren: z.number().optional(),
  militaryServiceStatus: z.string().optional(),
  occupation: z.string().optional(),
  landlinePhone: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyPhoneRelation: z.string().optional(),
  residentialAddress: z.string().optional(),
  workAddress: z.string().optional(),
  residentialPostalCode: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerEditFormProps {
  customer: Customer;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CustomerEditForm({
  customer,
  onSuccess,
  onCancel,
}: CustomerEditFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      insuranceType: customer.insuranceType || undefined,
      preferredChannel: (customer.preferredChannel || "whatsapp") as
        | "whatsapp"
        | "sms"
        | "email"
        | "telegram"
        | "bale"
        | "eita"
        | "instagram",
      status: (customer.status || "new") as
        | "new"
        | "contacted"
        | "target"
        | "active"
        | "deactivated",
      nationalId: customer.nationalId || undefined,
      birthCertificateNumber: customer.birthCertificateNumber || undefined,
      birthCertificateIssuancePlace:
        customer.birthCertificateIssuancePlace || undefined,
      placeOfBirth: customer.placeOfBirth || undefined,
      dateOfBirth: customer.dateOfBirth
        ? new Date(customer.dateOfBirth).toISOString().split("T")[0]
        : undefined,
      telegramId: customer.telegramId || undefined,
      whatsappId: customer.whatsappId || undefined,
      eitaId: customer.eitaId || undefined,
      baleId: customer.baleId || undefined,
      email: customer.email || undefined,
      gender: customer.gender || undefined,
      maritalStatus: customer.maritalStatus || undefined,
      numberOfChildren: customer.numberOfChildren || undefined,
      militaryServiceStatus: customer.militaryServiceStatus || undefined,
      occupation: customer.occupation || undefined,
      landlinePhone: customer.landlinePhone || undefined,
      emergencyPhone: customer.emergencyPhone || undefined,
      emergencyPhoneRelation: customer.emergencyPhoneRelation || undefined,
      residentialAddress: customer.residentialAddress || undefined,
      workAddress: customer.workAddress || undefined,
      residentialPostalCode: customer.residentialPostalCode || undefined,
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setLoading(true);
    try {
      // Convert undefined to null for database compatibility
      const updateData = Object.fromEntries(
        Object.entries({
          ...data,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString()
            : null,
          numberOfChildren: data.numberOfChildren ?? null,
        }).map(([key, value]) => [key, value === undefined ? null : value])
      );

      const response = await fetch(
        `/api/admin/outreach/customers/${customer.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );
      if (!response.ok) throw new Error("Failed to update customer");
      toast.success("مشتری با موفقیت بروزرسانی شد");
      onSuccess();
    } catch (error) {
      toast.error("خطا در بروزرسانی مشتری");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ویرایش مشتری</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام خانوادگی *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره تلفن *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کد ملی</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>جنسیت</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">مرد</SelectItem>
                        <SelectItem value="female">زن</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وضعیت تاهل</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">مجرد</SelectItem>
                        <SelectItem value="married">متاهل</SelectItem>
                        <SelectItem value="divorced">طلاق گرفته</SelectItem>
                        <SelectItem value="widowed">بیوه</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfChildren"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تعداد فرزندان</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insuranceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع بیمه</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredChannel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کانال ترجیحی *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="whatsapp">واتس‌اپ</SelectItem>
                        <SelectItem value="sms">پیامک</SelectItem>
                        <SelectItem value="email">ایمیل</SelectItem>
                        <SelectItem value="telegram">تلگرام</SelectItem>
                        <SelectItem value="bale">بله</SelectItem>
                        <SelectItem value="eita">ایتا</SelectItem>
                        <SelectItem value="instagram">اینستاگرام</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وضعیت *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">جدید</SelectItem>
                        <SelectItem value="contacted">
                          تماس گرفته شده
                        </SelectItem>
                        <SelectItem value="target">هدف</SelectItem>
                        <SelectItem value="active">فعال</SelectItem>
                        <SelectItem value="deactivated">غیرفعال</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شغل</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="militaryServiceStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وضعیت خدمت سربازی</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="completed">انجام شده</SelectItem>
                        <SelectItem value="exempt">معاف</SelectItem>
                        <SelectItem value="in-progress">
                          در حال انجام
                        </SelectItem>
                        <SelectItem value="not-applicable">نامنطبق</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاریخ تولد</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>محل تولد</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthCertificateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره شناسنامه</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthCertificateIssuancePlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>محل صدور شناسنامه</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="landlinePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تلفن ثابت</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تلفن اضطراری</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyPhoneRelation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نسبت تلفن اضطراری</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telegramId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شناسه تلگرام</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsappId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شناسه واتس‌اپ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eitaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شناسه ایتا</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شناسه بله</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="residentialPostalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کد پستی محل سکونت</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="residentialAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس محل سکونت</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس محل کار</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
