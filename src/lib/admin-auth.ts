import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  
  if (!session) {
    return { redirect: "/admin/login" };
  }

  const user = session.user as any;
  
  if (!user || !["ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER", "INVENTORY_MANAGER", "ORDER_MANAGER"].includes(user.role)) {
    return { redirect: "/" };
  }

  return { user };
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    SUPER_ADMIN: 5,
    ADMIN: 4,
    CONTENT_MANAGER: 3,
    INVENTORY_MANAGER: 3,
    ORDER_MANAGER: 3,
    CUSTOMER: 1,
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

export function canManageProducts(userRole: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"].includes(userRole);
}

export function canManageOrders(userRole: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"].includes(userRole);
}

export function canManageContent(userRole: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"].includes(userRole);
}

export function canManageSettings(userRole: string): boolean {
  return ["SUPER_ADMIN", "ADMIN"].includes(userRole);
}

export function canManageAdmins(userRole: string): boolean {
  return userRole === "SUPER_ADMIN";
}
