"use client";

import { useState, useMemo } from "react";
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
import { Edit, Trash2, MessageSquare, ArrowUpDown } from "lucide-react";

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

type SortField = "name" | "description" | "keywords" | "isActive" | "createdAt";
type SortDirection = "asc" | "desc";

const SortableHeader = ({
  field,
  children,
  onSort,
  currentField,
  currentDirection,
}: {
  field: SortField;
  children: React.ReactNode;
  onSort: (field: SortField) => void;
  currentField: SortField;
  currentDirection: SortDirection;
}) => (
  <TableHead
    className="text-right cursor-pointer hover:bg-gray-50"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center gap-1">
      {children}
      {currentField === field && <ArrowUpDown className="h-4 w-4" />}
    </div>
  </TableHead>
);

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  onManageTemplates,
}: ProductsTableProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      let aValue: string | number | boolean, bValue: string | number | boolean;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "description":
          aValue = a.description?.toLowerCase() || "";
          bValue = b.description?.toLowerCase() || "";
          break;
        case "keywords":
          aValue = a.keywords?.toLowerCase() || "";
          bValue = b.keywords?.toLowerCase() || "";
          break;
        case "isActive":
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [products, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              field="name"
              onSort={handleSort}
              currentField={sortField}
              currentDirection={sortDirection}
            >
              نام محصول
            </SortableHeader>
            <SortableHeader
              field="description"
              onSort={handleSort}
              currentField={sortField}
              currentDirection={sortDirection}
            >
              توضیحات
            </SortableHeader>
            <SortableHeader
              field="keywords"
              onSort={handleSort}
              currentField={sortField}
              currentDirection={sortDirection}
            >
              کلیدواژه‌ها
            </SortableHeader>
            <SortableHeader
              field="isActive"
              onSort={handleSort}
              currentField={sortField}
              currentDirection={sortDirection}
            >
              وضعیت
            </SortableHeader>
            <SortableHeader
              field="createdAt"
              onSort={handleSort}
              currentField={sortField}
              currentDirection={sortDirection}
            >
              تاریخ ایجاد
            </SortableHeader>
            <TableHead className="text-right">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                هیچ محصولی یافت نشد
              </TableCell>
            </TableRow>
          ) : (
            sortedProducts.map((product) => (
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
                  {new Date(product.createdAt).toLocaleString("fa-IR", {
                    timeZone: "Asia/Tehran",
                  })}
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
