// Counts how the timer is used, never who uses it: GoatCounter keeps no cookie and no identifier.
// Offline, or with the script blocked, nothing is counted and nothing breaks.
export function track(event) {
  window.goatcounter?.count?.({ path: event, event: true });
}
