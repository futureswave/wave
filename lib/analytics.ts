// Analytics event tracking
// Replace console.log with your actual analytics provider (e.g., Plausible, PostHog, GA4)

type AnalyticsEvent =
  | "click_whitelist"
  | "submit_whitelist_success"
  | "submit_whitelist_error"
  | "submit_whitelist_duplicate"
  | "click_social_x"
  | "click_social_discord"
  | "click_gitbook"
  | "click_magiceden"
  | "wallet_connect_success"
  | "wallet_disconnect"
  | "view_gallery_lightbox"
  | "scroll_depth_50"
  | "scroll_depth_90";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, properties);
  }
  // TODO: integrate your analytics provider here
  // Example: window.plausible?.(event, { props: properties })
}
