const SUPABASE_URL = "https://oajysgoeupdoonbempgz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_tBhLLkdy1XFacCWg-f8lNA_wKakcfJh";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const $ = (id) => document.getElementById(id);

let modules = [];

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function setStatus(text, type = "") {
  const el = $("status");
  if (!el) return;

  el.textContent = text;
  el.className = type ? status ${type} : "status";
}

async function loadModules() {
  setStatus("Memuat materi...");

  const { data, error } = await db
    .from("modules")
    .…
