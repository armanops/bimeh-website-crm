"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description?: string;
  keywords?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSaved: () => void;
}

const productTypes = [
  { value: "car-insurance", label: "بیمه خودرو" },
  { value: "health-insurance", label: "بیمه سلامت" },
  { value: "home-insurance", label: "بیمه مسکن" },
  { value: "travel-insurance", label: "بیمه مسافرتی" },
  { value: "life-insurance", label: "بیمه زندگی" },
];

export default function ProductModal({
  open,
  onClose,
  product,
  onSaved,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    keywords: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        keywords: product.keywords || "",
        isActive: product.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        keywords: "",
        isActive: true,
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("نام محصول الزامی است");
      return;
    }

    setLoading(true);
    try {
      const url = "/api/admin/products";
      const method = product ? "PUT" : "POST";
      const body = product ? { id: product.id, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save product");
      }

      toast.success(product ? "محصول ویرایش شد" : "محصول اضافه شد");
      onSaved();
    } catch (error) {
      toast.error("خطا در ذخیره محصول");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{product ? "ویرایش محصول" : "محصول جدید"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">نام محصول *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="مثال: بیمه شخص ثالث"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="توضیحات محصول"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">کلیدواژه‌ها</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              placeholder="کلیدواژه‌ها را با کاما جدا کنید (مثال: خودرو,ثالث,بیمه)"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              لغو
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ذخیره..." : product ? "ویرایش" : "اضافه کردن"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
