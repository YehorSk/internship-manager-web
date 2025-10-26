export function hasAccess(userRoles, allowedRoles = []) {
  if (!allowedRoles.length) return true
  if (!userRoles?.length) return false
  return userRoles.some(role => allowedRoles.includes(role))
}
