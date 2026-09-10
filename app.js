const SUPABASE_URL =
  "https://oajysgoeupdoonbempgz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_tBhLLkdy1XFacCWg-f8lNA_wKakcfJh";

let db;
let modules = [];

function $(id) {
  return document.getElementById(id);
}

function showMessage(text, type = "") {
  const authMsg = $("authMsg");

  if (authMsg) {
    authMsg.textContent = text;
    authMsg.className = type
      ? msg ${type}
      : "msg";
  }
}

function showLogin() {
  const loginScreen = $("loginScreen");
  const app = $("app");

  if (loginScreen) {
    loginScreen.classList.remove("hidden");
  }

  if (app) {
    app.classList.add("hidden");
  }
}

function showApp() {
  const loginScreen = $("loginScreen");
  const app = $("app");

  if (loginScreen) {
    loginScreen.cl…
