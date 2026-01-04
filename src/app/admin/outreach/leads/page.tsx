"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Phone,
  UserPlus,
  Users,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { convertLeadToCustomerAction, markLeadAsContacted } from "../actions";
import { useMessagingStore } from "@/lib/stores/messaging-store";
import GroupSelectionDialog from "@/components/admin/outreach/group-selection-dialog";
import LeadAddForm from "@/components/admin/outreach/lead-add-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LeadEditModal from "@/components/admin/outreach/lead-edit-modal";

interface Lead {
  id: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phone: string;
  product?: {
    id: number;
    name: string;
  };
  productId: number | null;
  source: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeadsPage() {
  const { addToGroup } = useMessagingStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [uniqueSources, setUniqueSources] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
  const limit = 10;

  const fetchLeads = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        sortBy: sortField,
        sortOrder: sortDirection,
        ...(searchTerm && { search: searchTerm }),
        ...(sourceFilter !== "all" && { source: sourceFilter }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(productFilter !== "all" && { productId: productFilter }),
      });
      const response = await fetch(`/api/admin/outreach/leads?${params}`);
      if (!response.ok) throw new Error("Failed to fetch leads");
      const data = await response.json();
      setLeads(data.leads);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      toast.error("خطا در بارگذاری لیدها");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchProducts();
    fetchUniqueSources();
    fetchUniqueStatuses();
  }, []);

  const fetchUniqueSources = async () => {
    try {
      const response = await fetch("/api/admin/outreach/leads?type=sources");
      if (!response.ok) throw new Error("Failed to fetch unique sources");
      const data = await response.json();
      setUniqueSources(data.sources);
    } catch (error) {
      console.error("Error fetching unique sources:", error);
    }
  };

  const fetchUniqueStatuses = async () => {
    try {
      const response = await fetch("/api/admin/outreach/leads?type=statuses");
      if (!response.ok) throw new Error("Failed to fetch unique statuses");
      const data = await response.json();
      setUniqueStatuses(data.statuses);
    } catch (error) {
      console.error("Error fetching unique statuses:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = () => {
    fetchLeads(search, 1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    fetchLeads(search, 1);
  };

  const handlePageChange = (newPage: number) => {
    fetchLeads(search, newPage);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "source":
        setSourceFilter(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      case "product":
        setProductFilter(value);
        break;
    }
    fetchLeads(search, 1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این لید را حذف کنید؟")) return;
    try {
      const response = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete lead");
      toast.success("لید با موفقیت حذف شد");
      fetchLeads(search, page);
    } catch (error) {
      toast.error("خطا در حذف لید");
      console.error(error);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update lead status");
      toast.success("وضعیت لید بروزرسانی شد");
      fetchLeads(search, page);
    } catch (error) {
      toast.error("خطا در بروزرسانی وضعیت لید");
      console.error(error);
    }
  };

  const handleConvertToCustomer = async (id: number) => {
    try {
      const result = await convertLeadToCustomerAction(id);
      if (result.success) {
        toast.success("لید به مشتری تبدیل شد");
        fetchLeads(search, page);
      } else {
        toast.error(result.error || "خطا در تبدیل");
      }
    } catch (error) {
      toast.error("خطا در تبدیل لید به مشتری");
      console.error(error);
    }
  };

  const handleMarkContacted = async (id: number) => {
    try {
      const result = await markLeadAsContacted(id);
      if (result.success) {
        toast.success("لید به عنوان تماس گرفته شده علامت‌گذاری شد");
        fetchLeads(search, page);
      } else {
        toast.error(result.error || "خطا در علامت‌گذاری");
      }
    } catch (error) {
      toast.error("خطا در علامت‌گذاری تماس");
      console.error(error);
    }
  };

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads((prev) => [...prev, leadId]);
    } else {
      setSelectedLeads((prev) => prev.filter((id) => id !== leadId));
    }
  };

  const handleAddToGroup = () => {
    if (selectedLeads.length === 0) return;
    setIsGroupDialogOpen(true);
  };

  const handleGroupDialogSuccess = () => {
    setSelectedLeads([]);
    fetchLeads(search, page); // Refresh to update any changes
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
  };

  const handleEditSuccess = () => {
    setEditingLead(null);
    fetchLeads(search, page); // Refresh to show updated data
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">مدیریت لیدها</h1>
        <p className="text-muted-foreground">
          مشاهده و مدیریت لیدهای وارد شده به سیستم.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فیلتر و جستجو</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="جستجو بر اساس نام یا شماره تلفن..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                منبع
              </label>
              <Select
                value={sourceFilter}
                onValueChange={(value) => handleFilterChange("source", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب منبع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه منابع</SelectItem>
                  {uniqueSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وضعیت
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "lead"
                        ? "لید"
                        : status === "contacted"
                        ? "تماس گرفته شده"
                        : status === "deactivated"
                        ? "غیرفعال"
                        : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select
              value={productFilter}
              onValueChange={(value) => handleFilterChange("product", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="محصول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه محصولات</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4 mt-4">
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              جستجو
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>لیدها ({total} مورد)</CardTitle>
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    افزودن لید جدید
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <LeadAddForm
                    onSuccess={() => {
                      setIsAddDialogOpen(false);
                      fetchLeads(search, page);
                    }}
                    onCancel={() => setIsAddDialogOpen(false)}
                    products={products}
                  />
                </DialogContent>
              </Dialog>
              {selectedLeads.length > 0 && (
                <Button onClick={handleAddToGroup} variant="secondary">
                  <Users className="h-4 w-4 mr-2" />
                  افزودن {selectedLeads.length} مورد به گروه
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>در حال بارگذاری...</p>
          ) : leads.length === 0 ? (
            <p>هیچ لیدی یافت نشد.</p>
          ) : (
            <>
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-12">
                        <Checkbox
                          checked={
                            selectedLeads.length === leads.length &&
                            leads.length > 0
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLeads(leads.map((lead) => lead.id));
                            } else {
                              setSelectedLeads([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="text-right">نام کامل</TableHead>
                      <TableHead className="text-right">نام</TableHead>
                      <TableHead className="text-right">نام خانوادگی</TableHead>
                      <TableHead className="text-right">شماره تلفن</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">محصول</TableHead>
                      <TableHead className="text-right">منبع</TableHead>
                      <TableHead
                        className="text-right cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center gap-1">
                          تاریخ ایجاد
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("updatedAt")}
                      >
                        <div className="flex items-center gap-1">
                          تاریخ بروزرسانی
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="text-right">
                          <Checkbox
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={(checked) =>
                              handleSelectLead(lead.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.fullName ||
                            `${lead.firstName || ""} ${lead.lastName || ""}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.firstName || ""}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.lastName || ""}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.phone}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={lead.status}
                            onValueChange={(value) =>
                              handleStatusChange(lead.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lead">لید</SelectItem>
                              <SelectItem value="contacted">
                                تماس گرفته شده
                              </SelectItem>
                              <SelectItem value="deactivated">
                                غیرفعال
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.product ? (
                            <Badge variant="secondary">
                              {lead.product.name}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.source || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(lead.createdAt).toLocaleString("fa-IR", {
                            timeZone: "Asia/Tehran",
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(lead.updatedAt).toLocaleString("fa-IR", {
                            timeZone: "Asia/Tehran",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditLead(lead)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConvertToCustomer(lead.id)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkContacted(lead.id)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(lead.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  صفحه {page} از {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                    قبلی
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    بعدی
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <GroupSelectionDialog
        isOpen={isGroupDialogOpen}
        onClose={() => setIsGroupDialogOpen(false)}
        userIds={selectedLeads}
        userType="lead"
        onSuccess={handleGroupDialogSuccess}
      />

      {/* Lead Edit Modal */}
      {editingLead && (
        <LeadEditModal
          isOpen={!!editingLead}
          onClose={() => setEditingLead(null)}
          lead={editingLead}
          onSuccess={handleEditSuccess}
          products={products}
        />
      )}
    </div>
  );
}
