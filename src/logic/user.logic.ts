export function isValidRole(role: string): boolean {
  const VALID_ROLES = ["admin", "user"];

  return VALID_ROLES.includes(role);
}