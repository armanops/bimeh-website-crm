import { create } from "zustand";
import type { Customer, Lead, Group } from "@/db/schema";

export type MessagingRecipient = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  type: "customer" | "lead";
};

interface MessagingStore {
  // Temporary group for quick selection (like before)
  selectedGroup: MessagingRecipient[];
  addToGroup: (recipient: MessagingRecipient) => void;
  removeFromGroup: (recipientId: number) => void;
  clearGroup: () => void;
  isInGroup: (recipientId: number) => boolean;

  // Persistent groups
  groups: Group[];
  selectedGroupId: number | null;
  loadGroups: (groups: Group[]) => void;
  selectGroup: (groupId: number | null) => void;
  getSelectedGroupMembers: () => MessagingRecipient[];
}

export const useMessagingStore = create<MessagingStore>((set, get) => ({
  // Temporary group functionality
  selectedGroup: [],

  addToGroup: (recipient: MessagingRecipient) => {
    const { selectedGroup, isInGroup } = get();
    if (!isInGroup(recipient.id)) {
      set({ selectedGroup: [...selectedGroup, recipient] });
    }
  },

  removeFromGroup: (recipientId: number) => {
    const { selectedGroup } = get();
    set({
      selectedGroup: selectedGroup.filter((r) => r.id !== recipientId),
    });
  },

  clearGroup: () => set({ selectedGroup: [] }),

  isInGroup: (recipientId: number) => {
    const { selectedGroup } = get();
    return selectedGroup.some((r) => r.id === recipientId);
  },

  // Persistent groups functionality
  groups: [],
  selectedGroupId: null,

  loadGroups: (groups: Group[]) => {
    set({ groups });
  },

  selectGroup: (groupId: number | null) => {
    set({ selectedGroupId: groupId });
  },

  getSelectedGroupMembers: async () => {
    const { selectedGroupId } = get();
    if (!selectedGroupId) return [];

    try {
      const response = await fetch(
        `/api/admin/outreach/groups/${selectedGroupId}`
      );
      if (!response.ok) return [];

      const data = await response.json();
      const members = data.members || [];

      // Convert group members to MessagingRecipient format
      // This would need to be enhanced to actually fetch the user data
      // For now, return empty array as this needs more implementation
      return [];
    } catch (error) {
      console.error("Error loading group members:", error);
      return [];
    }
  },
}));
