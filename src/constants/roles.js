// Roles as returned by the backend in the JWT / login response (e.g. "ROLE_MANAGER").
export const ROLES = {
  CUSTOMER: "ROLE_CUSTOMER",
  ADMIN: "ROLE_ADMIN",
  MANAGER: "ROLE_MANAGER",
  SUPERADMIN: "ROLE_SUPER_ADMIN",
};

// Only these roles may access the dashboard/app area.
export const DASHBOARD_ALLOWED_ROLES = [
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.SUPERADMIN,
];