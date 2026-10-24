/** Explicit opt-in; local development and Vercel previews never send visit emails. */
export function visitNotificationsEnabled(): boolean {
  return process.env.NODE_ENV === "production"
    && process.env.VERCEL === "1"
    && process.env.VERCEL_ENV === "production"
    && process.env.VISIT_NOTIFICATIONS_ENABLED === "true"
}
