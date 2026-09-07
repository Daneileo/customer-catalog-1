export function isMasterEnabled() {
  return process.env.NODE_ENV !== "production";
}
