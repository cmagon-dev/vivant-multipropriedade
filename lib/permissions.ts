import { UserRole } from "@prisma/client";

export function canCreate(role: UserRole): boolean {
  return ["ADMIN", "EDITOR"].includes(role);
}

export function canEdit(role: UserRole): boolean {
  return ["ADMIN", "EDITOR"].includes(role);
}

export function canDelete(role: UserRole): boolean {
  return role === "ADMIN";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "ADMIN";
}

export function canPublish(role: UserRole): boolean {
  return ["ADMIN", "EDITOR"].includes(role);
}
