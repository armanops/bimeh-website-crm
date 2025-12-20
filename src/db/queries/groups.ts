import { db } from "@/db";
import {
  groupsTable,
  groupMembersTable,
  Group,
  NewGroup,
  GroupMember,
  NewGroupMember,
} from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

// Group CRUD operations
export async function createGroup(data: NewGroup): Promise<Group> {
  const [group] = await db.insert(groupsTable).values(data).returning();
  return group;
}

export async function getGroups(): Promise<Group[]> {
  return await db.select().from(groupsTable).orderBy(groupsTable.createdAt);
}

export async function getGroupById(id: number): Promise<Group | null> {
  const [group] = await db
    .select()
    .from(groupsTable)
    .where(eq(groupsTable.id, id));
  return group || null;
}

export async function updateGroup(
  id: number,
  data: Partial<NewGroup>
): Promise<Group | null> {
  const [group] = await db
    .update(groupsTable)
    .set(data)
    .where(eq(groupsTable.id, id))
    .returning();
  return group || null;
}

export async function deleteGroup(id: number): Promise<boolean> {
  const result = await db
    .delete(groupsTable)
    .where(eq(groupsTable.id, id))
    .returning();
  return result.length > 0;
}

// Group member operations
export async function addUserToGroup(
  data: NewGroupMember
): Promise<GroupMember> {
  const [member] = await db.insert(groupMembersTable).values(data).returning();
  return member;
}

export async function addUsersToGroup(
  groupId: number,
  userIds: number[],
  userType: "lead" | "customer",
  addedBy?: string
): Promise<GroupMember[]> {
  const members = userIds.map((userId) => ({
    groupId,
    userId,
    userType,
    addedBy,
  }));

  return await db.insert(groupMembersTable).values(members).returning();
}

export async function removeUserFromGroup(
  groupId: number,
  userId: number,
  userType: "lead" | "customer"
): Promise<boolean> {
  const result = await db
    .delete(groupMembersTable)
    .where(
      and(
        eq(groupMembersTable.groupId, groupId),
        eq(groupMembersTable.userId, userId),
        eq(groupMembersTable.userType, userType)
      )
    )
    .returning();
  return result.length > 0;
}

export async function getGroupMembers(groupId: number): Promise<GroupMember[]> {
  return await db
    .select()
    .from(groupMembersTable)
    .where(eq(groupMembersTable.groupId, groupId))
    .orderBy(groupMembersTable.createdAt);
}

export async function getUserGroups(
  userId: number,
  userType: "lead" | "customer"
): Promise<Group[]> {
  const members = await db
    .select()
    .from(groupMembersTable)
    .where(
      and(
        eq(groupMembersTable.userId, userId),
        eq(groupMembersTable.userType, userType)
      )
    );

  if (members.length === 0) return [];

  const groupIds = members.map((m) => m.groupId);
  return await db
    .select()
    .from(groupsTable)
    .where(inArray(groupsTable.id, groupIds))
    .orderBy(groupsTable.createdAt);
}

export async function getGroupWithMembers(groupId: number): Promise<{
  group: Group;
  members: GroupMember[];
} | null> {
  const group = await getGroupById(groupId);
  if (!group) return null;

  const members = await getGroupMembers(groupId);
  return { group, members };
}

export async function removeUsersFromGroup(
  groupId: number,
  userIds: number[],
  userType: "lead" | "customer"
): Promise<boolean> {
  const result = await db
    .delete(groupMembersTable)
    .where(
      and(
        eq(groupMembersTable.groupId, groupId),
        inArray(groupMembersTable.userId, userIds),
        eq(groupMembersTable.userType, userType)
      )
    )
    .returning();
  return result.length > 0;
}
