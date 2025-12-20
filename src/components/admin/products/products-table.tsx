"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MessageSquare } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description?: string;
  keywords?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  onManageTemplates: (product: Product) => void;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  onManageTemplates,
}: ProductsTableProps) {
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">نام محصول</TableHead>
            <TableHead className="text-right">توضیحات</TableHead>
            <TableHead className="text-right">کلیدواژه‌ها</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
            <TableHead className="text-right">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                هیچ محصولی یافت نشد
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {product.description || "-"}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {product.keywords || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onEdit(product)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onManageTemplates(product)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title="مدیریت قالب‌های پیام"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onDelete(product.id)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
