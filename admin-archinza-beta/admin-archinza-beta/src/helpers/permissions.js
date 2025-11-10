// Permission helpers for RBAC

export function isSuperAdmin(role) {
  if (!role || !role.permissions) return false;

  return role.permissions.some(
    (perm) => perm.resource === "*" && perm.action === "*"
  );
}

export function hasExactPermission(role, permissionName) {
  if (!role || !role.permissions) return false;
  return role.permissions.some((perm) => perm.name === permissionName);
}

export function hasPermission(role, permissionName) {
  // console.log(isSuperAdmin(role));
  if (isSuperAdmin(role)) return true;
  if (!role || !role.permissions) return false;
  return role.permissions.some((perm) => perm.name === permissionName);
}

export function hasResourceAction(role, resource, action) {
  if (isSuperAdmin(role)) return true;
  if (!role || !role.permissions) return false;
  return role.permissions.some(
    (perm) => perm.resource === resource && perm.action === action
  );
}
