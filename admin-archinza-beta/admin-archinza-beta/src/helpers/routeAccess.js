import { hasPermission, isSuperAdmin } from "./permissions";
import { MODULE_PERMISSIONS } from "../config/modulePermissions";

export function canAccessRoute(role, route) {
  if (isSuperAdmin(role)) return true;
  const required = MODULE_PERMISSIONS[route];
  if (!required) return true; // No restriction
  return required.some((perm) => hasPermission(role, perm));
}
