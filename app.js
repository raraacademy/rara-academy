const SUPABASE_URL =
  "https://oajysgoeupdoonbempgz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_tBhLLkdy1XFacCWg-f8lNA_wKakcfJh";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* =========================
   HELPER
========================= */

const $ = (id) =>
  document.getElementById(id);

let modules = [];


/* =========================
   MESSAGE
========================= */

function setMessage(text, type = "") {

  const authMsg = $("authMsg");
  const status = $("status");

  if (authMsg) {
    authMsg.textContent = text;
    authMsg.className =
      type ? msg ${type} : "msg";
  }

  if (status) {
    status.textContent = text;
    status.className =
      type ? muted ${type} : "m…
