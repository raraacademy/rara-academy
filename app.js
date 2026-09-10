const SUPABASE_URL = "https://oajysgoeupdoonbempgz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "GANTI_DENGAN_KEY_PUBLISHABLE_KAMU";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const $ = (id) => document.getElementById(id);

function setStatus(text, type = "") {
  const el = $("status");
  if (!el) return;

  el.textContent = text;
  el.className = type ? status ${type} : "status";
}

function showLogin() {
  const login = $("loginScreen");
  const app = $("app");

  if (login) login.classList.remove("hidden");
  if (app) app.classList.add("hidden");
}

function showApp() {
  const login = $("loginScreen");
  const app = $("app");

  if (login) login.classList.add("hidden");
  if (app) app.classList.remove("hid…
