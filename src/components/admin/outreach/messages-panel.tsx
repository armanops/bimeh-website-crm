"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Send, MessageSquare, Eye, ExternalLink, X, Users } from "lucide-react";
import {
  sendWhatsAppMessage,
  logActivity,
  getMessagePreview,
} from "@/app/admin/outreach/actions";
import { replaceTemplateVariables } from "@/lib/template-utils";
import { toast } from "sonner";
import {
  useMessagingStore,
  type MessagingRecipient,
} from "@/lib/stores/messaging-store";
import type {
  MessageTemplate,
  Customer,
  Lead,
  CustomerStatus,
  LeadStatus,
  MessageChannel,
} from "@/db/schema";

type Recipient = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  type: "customer" | "lead";
  [key: string]: unknown;
};

interface MessagesPanelProps {
  templates: MessageTemplate[];
  recipients: Recipient[];
}

export function MessagesPanel({ templates, recipients }: MessagesPanelProps) {
  const {
    selectedGroup,
    removeFromGroup,
    groups,
    selectedGroupId,
    loadGroups,
    selectGroup,
    getSelectedGroupMembers,
  } = useMessagingStore();
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );
  const [messageText, setMessageText] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Show all templates - users can select any template regardless of recipient
  const availableTemplates = templates;

  // Load groups on component mount
  useEffect(() => {
    const loadGroupsData = async () => {
      try {
        const response = await fetch("/api/admin/outreach/groups?limit=100");
        if (response.ok) {
          const data = await response.json();
          loadGroups(data.groups);
        }
      } catch (error) {
        console.error("Error loading groups:", error);
      }
    };
    loadGroupsData();
  }, [loadGroups]);

  const handleSelectFromGroup = (groupRecipient: MessagingRecipient) => {
    // Find the full recipient data from the recipients prop
    const fullRecipient = recipients.find((r) => r.id === groupRecipient.id);
    if (fullRecipient) {
      setSelectedRecipient(fullRecipient);
    }
  };

  // Update message text when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setMessageText(selectedTemplate.templateText);
    }
  }, [selectedTemplate]);

  // Update preview when message or recipient changes
  useEffect(() => {
    if (messageText && selectedRecipient) {
      const preview = replaceTemplateVariables(messageText, selectedRecipient);
      setPreviewMessage(preview);
    } else {
      setPreviewMessage(messageText);
    }
  }, [messageText, selectedRecipient]);

  const handleSendMessage = async (removeAfterSend = false) => {
    if (!selectedRecipient || !messageText.trim()) {
      toast.error("لطفاً گیرنده و متن پیام را انتخاب کنید");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendWhatsAppMessage(
        selectedRecipient,
        messageText,
        selectedTemplate?.name,
        "admin" // TODO: Get actual admin ID
      );

      if (result.success) {
        toast.success("پیام با موفقیت ارسال شد");
        // Open WhatsApp link in new tab
        window.open(result.whatsappUrl, "_blank");

        // Remove from group if requested
        if (removeAfterSend) {
          removeFromGroup(selectedRecipient.id);
          setSelectedRecipient(null);
        }
      } else {
        toast.error(result.error || "خطا در ارسال پیام");
      }
    } catch (error) {
      toast.error("خطا در ارسال پیام");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogActivity = async () => {
    if (!selectedRecipient || !messageText.trim()) {
      toast.error("لطفاً گیرنده و متن پیام را انتخاب کنید");
      return;
    }

    setIsLoading(true);
    try {
      const result = await logActivity(
        selectedRecipient,
        messageText,
        "whatsapp",
        selectedTemplate?.name,
        "admin" // TODO: Get actual admin ID
      );

      if (result.success) {
        toast.success("فعالیت با موفقیت ثبت شد");
      } else {
        toast.error(result.error || "خطا در ثبت فعالیت");
      }
    } catch (error) {
      toast.error("خطا در ثبت فعالیت");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Group Table */}
      {selectedGroup.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              گروه انتخاب شده ({selectedGroup.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام و نام خانوادگی</TableHead>
                  <TableHead>شماره تلفن</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedGroup.map((recipient) => (
                  <TableRow
                    key={recipient.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSelectFromGroup(recipient)}
                  >
                    <TableCell>
                      {recipient.firstName} {recipient.lastName}
                    </TableCell>
                    <TableCell>{recipient.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          recipient.type === "customer"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {recipient.type === "customer" ? "مشتری" : "لید"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromGroup(recipient.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Composer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              تنظیمات پیام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                قالب پیام
              </label>
              <Select
                value={selectedTemplate?.id.toString() || ""}
                onValueChange={(value) => {
                  const template = availableTemplates.find(
                    (t) => t.id.toString() === value
                  );
                  setSelectedTemplate(template || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب قالب..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
                      {template.name} ({template.channel}){" "}
                      {template.productId ? "(محصول خاص)" : "(عمومی)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                انتخاب گروه
              </label>
              <Select
                value={selectedGroupId?.toString() || "none"}
                onValueChange={(value) =>
                  selectGroup(value === "none" ? null : parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب گروه..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون گروه</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recipient Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">گیرنده</label>
              <Select
                value={selectedRecipient?.id.toString() || ""}
                onValueChange={(value) => {
                  const recipient = recipients.find(
                    (r) => r.id.toString() === value
                  );
                  setSelectedRecipient(recipient || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب گیرنده..." />
                </SelectTrigger>
                <SelectContent>
                  {recipients.map((recipient) => (
                    <SelectItem
                      key={`${recipient.type}-${recipient.id}`}
                      value={recipient.id.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          {recipient.firstName} {recipient.lastName}
                        </span>
                        <Badge
                          variant={
                            recipient.type === "customer"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {recipient.type === "customer" ? "مشتری" : "لید"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {recipient.phone}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Text */}
            <div>
              <label className="block text-sm font-medium mb-2">متن پیام</label>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="متن پیام را وارد کنید..."
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => handleSendMessage(false)}
                disabled={
                  isLoading || !selectedRecipient || !messageText.trim()
                }
                className="flex-1 min-w-[120px]"
              >
                <Send className="h-4 w-4 mr-2" />
                ارسال واتس‌اپ
              </Button>
              {selectedGroup.some((r) => r.id === selectedRecipient?.id) && (
                <Button
                  onClick={() => handleSendMessage(true)}
                  disabled={
                    isLoading || !selectedRecipient || !messageText.trim()
                  }
                  variant="secondary"
                  className="flex-1 min-w-[120px]"
                >
                  <Send className="h-4 w-4 mr-2" />
                  ارسال و حذف از گروه
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLogActivity}
                disabled={
                  isLoading || !selectedRecipient || !messageText.trim()
                }
                className="flex-1 min-w-[120px]"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                ثبت فعالیت
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              پیش‌نمایش پیام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRecipient && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  گیرنده: {selectedRecipient.firstName}{" "}
                  {selectedRecipient.lastName} - {selectedRecipient.phone}
                  <Badge
                    variant={
                      selectedRecipient.type === "customer"
                        ? "default"
                        : "secondary"
                    }
                    className="mr-2"
                  >
                    {selectedRecipient.type === "customer" ? "مشتری" : "لید"}
                  </Badge>
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                متن نهایی
              </label>
              <div className="bg-gray-50 border rounded-lg p-4 min-h-[120px] whitespace-pre-wrap font-mono text-sm">
                {previewMessage || "پیش‌نمایشی موجود نیست"}
              </div>
            </div>

            {selectedRecipient && messageText && (
              <div className="text-sm text-gray-600">
                <p>متغیرهای جایگزین شده:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>firstName: {selectedRecipient.firstName}</li>
                  <li>lastName: {selectedRecipient.lastName}</li>
                  <li>phone: {selectedRecipient.phone}</li>
                  {/* Add more fields as needed */}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
