export const PERMISSIONS = {
  PRODUCT_VIEW:    "product.view",
  PRODUCT_CREATE:  "product.create",
  PRODUCT_EDIT:    "product.edit",
  PRODUCT_DELETE:  "product.delete",
  ORDER_VIEW:      "order.view",
  ORDER_UPDATE:    "order.update",
  ORDER_DELETE:    "order.delete",
  CUSTOMER_VIEW:   "customer.view",
  CUSTOMER_EDIT:   "customer.edit",
  REPORT_VIEW:     "report.view",
  COUPON_MANAGE:   "coupon.manage",
  USER_MANAGE:     "user.manage",
  SETTINGS_MANAGE: "settings.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export const PERMISSION_LABELS: Record<Permission, string> = {
  "product.view":    "View Products",
  "product.create":  "Create Products",
  "product.edit":    "Edit Products",
  "product.delete":  "Delete Products",
  "order.view":      "View Orders",
  "order.update":    "Update Orders",
  "order.delete":    "Delete Orders",
  "customer.view":   "View Customers",
  "customer.edit":   "Edit Customers",
  "report.view":     "View Reports",
  "coupon.manage":   "Manage Coupons",
  "user.manage":     "Manage Staff",
  "settings.manage": "Manage Settings",
};

export const PERMISSION_CATEGORIES: Record<string, Permission[]> = {
  Products:       ["product.view", "product.create", "product.edit", "product.delete"],
  Orders:         ["order.view", "order.update", "order.delete"],
  Customers:      ["customer.view", "customer.edit"],
  Reports:        ["report.view"],
  Marketing:      ["coupon.manage"],
  Administration: ["user.manage", "settings.manage"],
};

// Predefined role templates that Super Admin can choose when creating staff
export const ROLE_PRESETS: Record<string, Permission[]> = {
  Admin: ALL_PERMISSIONS.filter(
    (p) => p !== "user.manage" && p !== "settings.manage"
  ),
  "Store Manager": [
    "product.view", "product.create", "product.edit",
    "order.view", "order.update",
    "customer.view",
    "report.view",
  ],
  "Inventory Manager": [
    "product.view", "product.create", "product.edit", "product.delete",
    "report.view",
  ],
  "Order Manager": ["order.view", "order.update", "customer.view"],
  "Customer Support": ["order.view", "customer.view", "customer.edit"],
  "Marketing Manager": ["coupon.manage", "product.view", "report.view"],
};
