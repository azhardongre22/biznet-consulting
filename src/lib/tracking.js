// ---------------------------------------------------------------------------
// Central analytics event layer for the Biznet site.
//
// Every tracked interaction funnels through `pushEvent`, which writes to
// `window.dataLayer` — the queue Google Tag Manager reads. GTM is NOT required
// for this to be safe: until the GTM snippet is installed the pushes simply
// accumulate on the array, and GTM replays them once it loads. That means we
// can instrument the app now and connect GTM/GA4/Ads/Meta/LinkedIn later
// without touching component code again.
//
// Keep ALL event names in ANALYTICS_EVENTS so the taxonomy stays in one place
// and matches the GTM trigger/tag configuration exactly.
// ---------------------------------------------------------------------------

export const ANALYTICS_EVENTS = {
  // Page / route level
  LANDING_PAGE_VIEW: "landing_page_view",
  SERVICE_PAGE_VIEW: "service_page_view",

  // Interaction
  CTA_CLICK: "cta_click",
  WHATSAPP_CLICK: "whatsapp_click",
  // GA4-standard content share (article share rail). Kept separate from
  // whatsapp_click so WhatsApp *lead* clicks stay a clean conversion metric.
  SHARE: "share",

  // Form funnel
  FORM_START: "form_start",
  FORM_STEP_1_COMPLETE: "form_step_1_complete",
  FORM_SUBMIT: "form_submit",

  // Downstream / CRM lifecycle (fired later from backend/CRM stage)
  CALENDAR_BOOKED: "calendar_booked",
  QUALIFIED_LEAD: "qualified_lead",
  MEETING_HELD: "meeting_held",
  PROPOSAL_SENT: "proposal_sent",
  DEAL_WON: "deal_won",
};

/** Lazily ensure window.dataLayer exists and return it (null during SSR). */
function getDataLayer() {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

/**
 * Push a named event onto the dataLayer.
 * @param {string} event  One of ANALYTICS_EVENTS.
 * @param {object} params Extra key/values for GTM variables (flat, GTM-safe).
 */
export function pushEvent(event, params = {}) {
  const dl = getDataLayer();
  if (!dl || !event) return;

  dl.push({
    event,
    ...params,
    // Timestamp helps de-dupe and debug; harmless to GTM.
    event_time: Date.now(),
  });

  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
  }
}

/**
 * Convenience wrapper for the WhatsApp float / links.
 * `location` should describe where the click happened (e.g. "floating-button").
 */
export function trackWhatsAppClick({ location = "floating-button", ...rest } = {}) {
  pushEvent(ANALYTICS_EVENTS.WHATSAPP_CLICK, {
    channel: "whatsapp",
    click_location: location,
    page_path:
      typeof window !== "undefined" ? window.location.pathname : undefined,
    ...rest,
  });
}

/**
 * GA4-standard `share` event for content share buttons (e.g. article rail).
 * @param {string} method      Channel: 'whatsapp' | 'linkedin' | 'x' | 'facebook' | 'copy_link'.
 * @param {string} contentType What was shared (default "article").
 * @param {string} itemId      Identifier of the shared item (e.g. article slug).
 */
export function trackShare({ method, contentType = "article", itemId, ...rest } = {}) {
  pushEvent(ANALYTICS_EVENTS.SHARE, {
    method,
    content_type: contentType,
    item_id: itemId,
    page_path:
      typeof window !== "undefined" ? window.location.pathname : undefined,
    ...rest,
  });
}
