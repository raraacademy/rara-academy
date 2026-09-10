const SUPABASE_URL = "https://oajysgoeupdoonbempgz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_tBhLLkdy1XFacCWg-f8lNA_wKakcfJh";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const $ = (id) => document.getElementById(id);

let modules = [];


/* =========================
   STATUS
========================= */

function setStatus(text, type = "") {
  const el = $("status");

  if (!el) return;

  el.textContent = text;

  el.className = type
    ? status ${type}
    : "status";
}


/* =========================
   LOGIN SCREEN
========================= */

function showLogin() {
  const login = $("loginScreen");
  const app = $("app");

  if (login) {
    login.classList.remove("hidden");
  }

  …
