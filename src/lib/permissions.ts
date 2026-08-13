// Permission checking system for admin dashboard

export const PERMISSIONS = {
  // Media permissions
  MEDIA_VIEW: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  MEDIA_UPLOAD: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  MEDIA_DELETE: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  
  // Homepage permissions
  HOMEPAGE_VIEW: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  HOMEPAGE_EDIT: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  
  // Settings permissions
  SETTINGS_VIEW: ["SUPER_ADMIN", "ADMIN"],
  SETTINGS_EDIT: ["SUPER_ADMIN", "ADMIN"],
  
  // Product permissions
  PRODUCTS_VIEW: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"],
  PRODUCTS_CREATE: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"],
  PRODUCTS_EDIT: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"],
  PRODUCTS_DELETE: ["SUPER_ADMIN", "ADMIN"],
  PRODUCTS_PUBLISH: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"],
  PRODUCTS_ARCHIVE: ["SUPER_ADMIN", "ADMIN"],
  
  // Order permissions
  ORDERS_VIEW: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  ORDERS_EDIT: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  ORDERS_DELETE: ["SUPER_ADMIN", "ADMIN"],
  
  // Payment permissions
  PAYMENTS_VIEW: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  PAYMENTS_EDIT: ["SUPER_ADMIN", "ADMIN"],
  PAYMENTS_DELETE: ["SUPER_ADMIN"],
  
  // Customer permissions
  CUSTOMERS_VIEW: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  CUSTOMERS_EDIT: ["SUPER_ADMIN", "ADMIN"],
  CUSTOMERS_DELETE: ["SUPER_ADMIN"],
  
  // Enquiry permissions
  ENQUIRIES_VIEW: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  ENQUIRIES_EDIT: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  ENQUIRIES_DELETE: ["SUPER_ADMIN", "ADMIN"],
  
  // Trade-in permissions
  TRADE_IN_VIEW: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  TRADE_IN_EDIT: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  TRADE_IN_DELETE: ["SUPER_ADMIN", "ADMIN"],
  
  // FAQ permissions
  FAQ_VIEW: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  FAQ_EDIT: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  
  // Blog permissions
  BLOG_VIEW: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  BLOG_CREATE: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  BLOG_EDIT: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  BLOG_DELETE: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  
  // About Us permissions
  ABOUT_VIEW: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  ABOUT_EDIT: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  
  // Contact permissions
  CONTACT_VIEW: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  CONTACT_EDIT: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  
  // Navigation permissions
  NAVIGATION_VIEW: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  NAVIGATION_EDIT: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  
  // Categories permissions
  CATEGORIES_VIEW: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"],
  CATEGORIES_EDIT: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"],
  
  // Promotions permissions
  PROMOTIONS_VIEW: ["SUPER_ADMIN", "ADMIN"],
  PROMOTIONS_EDIT: ["SUPER_ADMIN", "ADMIN"],
  
  // Reviews permissions
  REVIEWS_VIEW: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  REVIEWS_MODERATE: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  
  // Admin User permissions
  ADMIN_USERS_VIEW: ["SUPER_ADMIN"],
  ADMIN_USERS_CREATE: ["SUPER_ADMIN"],
  ADMIN_USERS_EDIT: ["SUPER_ADMIN"],
  ADMIN_USERS_DELETE: ["SUPER_ADMIN"],
  
  // Audit Logs permissions
  AUDIT_LOGS_VIEW: ["SUPER_ADMIN"],
  
  // Analytics permissions
  ANALYTICS_VIEW: ["SUPER_ADMIN", "ADMIN"],
  
  // Notifications permissions
  NOTIFICATIONS_VIEW: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER", "INVENTORY_MANAGER"],
  NOTIFICATIONS_MANAGE: ["SUPER_ADMIN", "ADMIN"],
  
  // System Health permissions
  SYSTEM_HEALTH_VIEW: ["SUPER_ADMIN"],
} as const;

export function requirePermission(userRole: string, permission: keyof typeof PERMISSIONS): void {
  const allowedRoles = PERMISSIONS[permission];
  
  if (!allowedRoles) {
    throw new Error(`Permission "${permission}" does not exist in permissions system`);
  }
  
  if (!userRole) {
    throw new Error(`Permission denied: User role is undefined`);
  }
  
  if (!allowedRoles.includes(userRole as any)) {
    throw new Error(`Permission denied: ${permission} requires one of ${allowedRoles.join(", ")}`);
  }
}

export function hasPermission(userRole: string, permission: keyof typeof PERMISSIONS): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole as any);
}

export function getPermissionsForRole(role: string): string[] {
  const permissions: string[] = [];
  
  for (const [permission, allowedRoles] of Object.entries(PERMISSIONS)) {
    if (allowedRoles.includes(role as any)) {
      permissions.push(permission);
    }
  }
  
  return permissions;
}
