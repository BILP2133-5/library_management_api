export function isValidRole(role: string): boolean {
  const VALID_ROLES = ["user", "admin", "superadmin"];

  return VALID_ROLES.includes(role);
}