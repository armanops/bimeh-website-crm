"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Package } from "lucide-react";
import ProductsTable from "@/components/admin/products/products-table";
import ProductModal from "@/components/admin/products/product-modal";

interface Product {
  id: number;
  name: string;
  description?: string;
  keywords?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      toast.error("خطا در بارگذاری محصولات");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟")) return;

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("محصول با موفقیت حذف شد");
      fetchProducts();
    } catch (error) {
      toast.error("خطا در حذف محصول");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSaved = () => {
    fetchProducts();
    handleModalClose();
  };

  if (loading) {
    return (
      <div className="p-6" dir="rtl">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
          <p className="text-muted-foreground">
            محصولات بیمه را اضافه، ویرایش و حذف کنید.
          </p>
        </div>
        <Button
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          محصول جدید
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            لیست محصولات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </CardContent>
      </Card>

      <ProductModal
        open={modalOpen}
        onClose={handleModalClose}
        product={editingProduct}
        onSaved={handleProductSaved}
      />
    </div>
  );
}
