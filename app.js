/* =========================================================
   RARA ACADEMY
   Supabase + Login + Modules
   ========================================================= */

/* =========================
   1. SUPABASE CONFIG
   ========================= */

const SUPABASE_URL = "https://oajysgoeupdoonbempgz.supabase.co";

/*
  PENTING:
  Ganti teks di bawah dengan SUPABASE PUBLISHABLE KEY
  milik project Anda.

  JANGAN masukkan service_role key di sini.
*/
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_tBhLLkdy1XFacCWg-f8lNA_wKakcfJh;


/* =========================
   2. INITIALIZE SUPABASE
   ========================= */

let db = null;

try {
  if (!window.supabase) {
    throw new Error(
      "Supabase library tidak ditemukan. Pastikan CDN Supabase ada di index.html."
    );
  }

  db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

} catch (error) {
  console.error("Supabase initialization error:", error);
}


/* =========================
   3. HELPER
   ========================= */

const $ = (id) => document.getElementById(id);

let modules = [];
let currentUser = null;


/* =========================
   4. ESCAPE HTML
   ========================= */

function esc(value) {
  return String(value ?? "")
    .replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
}


/* =========================
   5. SHOW / HIDE SCREEN
   ========================= */

function showLogin() {
  $("loginScreen")?.classList.remove("hidden");
  $("app")?.classList.add("hidden");
}

function showApp() {
  $("loginScreen")?.classList.add("hidden");
  $("app")?.classList.remove("hidden");
}


/* =========================
   6. AUTH MESSAGE
   ========================= */

function setAuthMessage(message = "", type = "") {
  const el = $("authMsg");

  if (!el) return;

  el.textContent = message;
  el.className = "msg";

  if (type) {
    el.classList.add(type);
  }
}


/* =========================
   7. STATUS MESSAGE
   ========================= */

function setStatus(message) {
  const el = $("status");

  if (el) {
    el.textContent = message;
  }
}


/* =========================
   8. LOADING BUTTON
   ========================= */

function setLoginLoading(isLoading) {
  const form = $("loginForm");

  if (!form) return;

  const button = form.querySelector("button[type='submit']");

  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = "Memproses...";
  } else {
    button.disabled = false;

    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
    }
  }
}


/* =========================
   9. LOAD MODULES
   ========================= */

async function loadModules() {

  if (!db) {
    setStatus("Supabase belum terhubung.");
    return;
  }

  setStatus("Memuat materi...");

  const container = $("modules");
  const empty = $("empty");

  if (container) {
    container.innerHTML = "";
  }

  empty?.classList.add("hidden");

  try {

    /*
      Kita menggunakan select("*") supaya lebih fleksibel
      dengan struktur tabel modules Anda.

      Kolom yang dipakai oleh tampilan:
      - id
      - module_number
      - title
      - is_published
      - is_locked
      - description
      - content
      - video_url
    */

    const { data, error } = await db
      .from("modules")
      .select("*")
      .order("module_number", {
        ascending: true
      });

    if (error) {
      console.error("Supabase modules error:", error);

      setStatus(
        "Gagal mengambil materi: " + error.message
      );

      if (container) {
        container.innerHTML = `
          <div class="empty">
            <div>!</div>
            <h4>Materi belum dapat dimuat</h4>
            <p>${esc(error.message)}</p>
          </div>
        `;
      }

      return;
    }

    modules = Array.isArray(data) ? data : [];

    /*
      Hanya tampilkan materi yang published.

      Kalau kolom is_published belum ada,
      materi tetap ditampilkan.
    */
    const visibleModules = modules.filter((item) => {

      if (
        Object.prototype.hasOwnProperty.call(
          item,
          "is_published"
        )
      ) {
        return item.is_published === true;
      }

      return true;
    });

    modules = visibleModules;

    updateHeroCount(modules.length);

    renderModules(modules);

  } catch (error) {

    console.error("loadModules error:", error);

    setStatus(
      "Terjadi kesalahan saat memuat materi."
    );

    if (container) {
      container.innerHTML = `
        <div class="empty">
          <div>!</div>
          <h4>Terjadi kesalahan</h4>
          <p>${esc(error.message)}</p>
        </div>
      `;
    }
  }
}


/* =========================
   10. UPDATE MODULE COUNT
   ========================= */

function updateHeroCount(count) {

  const el = $("heroCount");

  if (!el) return;

  el.textContent = Number(count || 0);
}


/* =========================
   11. RENDER MODULES
   ========================= */

function renderModules(list) {

  const container = $("modules");
  const empty = $("empty");

  if (!container) return;

  container.innerHTML = "";

  if (!list || list.length === 0) {

    empty?.classList.remove("hidden");

    setStatus("Belum ada materi yang tersedia.");

    return;
  }

  empty?.classList.add("hidden");

  setStatus(
    ${list.length} materi tersedia
  );

  list.forEach((module, index) => {

    const card = document.createElement("article");

    card.className = "module-card";

    const number =
      module.module_number ??
      module.number ??
      index + 1;

    const title =
      module.title ??
      Materi ${number};

    const description =
      module.description ??
      module.summary ??
      "Materi pembelajaran Rara Academy.";

    const locked =
      module.is_locked === true;

    const videoUrl =
      module.video_url ??
      module.video ??
      module.video_link ??
      "";

    card.innerHTML = `
      <div class="module-number">
        ${esc(String(number).padStart(2, "0"))}
      </div>

      <div class="module-body">

        <div class="module-top">
          <span class="module-label">
            ${locked ? "TERKUNCI" : "MATERI"}
          </span>

          <span class="module-icon">
            ${locked ? "🔒" : "→"}
          </span>
        </div>

        <h4>${esc(title)}</h4>

        <p>
          ${esc(description)}
        </p>

        <button
          class="module-btn"
          type="button"
          data-id="${esc(module.id)}"
          ${locked ? "disabled" : ""}
        >
          ${
            locked
              ? "Materi Terkunci"
              : "Buka Materi →"
          }
        </button>

      </div>
    `;

    const button =
      card.querySelector(".module-btn");

    if (button && !locked) {

      button.addEventListener(
        "click",
        () => openModule(module)
      );
    }

    container.appendChild(card);
  });
}


/* =========================
   12. OPEN MODULE
   ========================= */

function openModule(module) {

  /*
    Jika nanti kita sudah membuat halaman
    detail lesson, fungsi ini bisa diarahkan
    ke halaman tersebut.

    Untuk sementara:
    - Jika ada video_url, buka video.
    - Jika tidak ada, tampilkan informasi materi.
  */

  const videoUrl =
    module.video_url ??
    module.video ??
    module.video_link ??
    "";

  if (videoUrl) {

    window.open(
      videoUrl,
      "_blank",
      "noopener,noreferrer"
    );

    return;
  }

  const title =
    module.title ??
    "Materi Rara Academy";

  const content =
    module.content ??
    module.description ??
    "Materi belum memiliki isi.";

  alert(
    ${title}\n\n${content}
  );
}


/* =========================
   13. SEARCH MODULES
   ========================= */

function searchModules(keyword) {

  const query =
    String(keyword || "")
      .trim()
      .toLowerCase();

  if (!query) {

    renderModules(modules);

    return;
  }

  const filtered =
    modules.filter((module) => {

      const title =
        String(module.title || "")
          .toLowerCase();

      const description =
        String(
          module.description ||
          module.summary ||
          ""
        ).toLowerCase();

      const content =
        String(module.content || "")
          .toLowerCase();

      const number =
        String(
          module.module_number ||
          module.number ||
          ""
        ).toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        content.includes(query) ||
        number.includes(query)
      );
    });

  renderModules(filtered);

  if ($("status")) {

    $("status").textContent =
      ${filtered.length} materi ditemukan;
  }
}


/* =========================
   14. LOGIN
   ========================= */

async function login(email, password) {

  if (!db) {

    setAuthMessage(
      "Supabase belum terhubung.",
      "error"
    );

    return;
  }

  setLoginLoading(true);

  setAuthMessage(
    "Memeriksa akun..."
  );

  try {

    const {
      data,
      error
    } = await db.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {

      console.error(
        "Login error:",
        error
      );

      setAuthMessage(
        translateAuthError(error),
        "error"
      );

      return;
    }

    currentUser =
      data?.user || null;

    setAuthMessage("");

    showApp();

    await loadModules();

  } catch (error) {

    console.error(
      "Unexpected login error:",
      error
    );

    setAuthMessage(
      "Terjadi kesalahan. Silakan coba lagi.",
      "error"
    );

  } finally {

    setLoginLoading(false);
  }
}


/* =========================
   15. LOGOUT
   ========================= */

async function logout() {

  if (!db) return;

  try {

    const {
      error
    } = await db.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );

      return;
    }

    currentUser = null;

    modules = [];

    showLogin();

    setAuthMessage("");

    if ($("email")) {
      $("email").value = "";
    }

    if ($("password")) {
      $("password").value = "";
    }

  } catch (error) {

    console.error(
      "Unexpected logout error:",
      error
    );
  }
}


/* =========================
   16. AUTH ERROR TRANSLATION
   ========================= */

function translateAuthError(error) {

  const message =
    String(
      error?.message || ""
    ).toLowerCase();

  if (
    message.includes(
      "invalid login credentials"
    )
  ) {
    return "Email atau password salah.";
  }

  if (
    message.includes(
      "email not confirmed"
    )
  ) {
    return "Email belum dikonfirmasi. Silakan cek email Anda.";
  }

  if (
    message.includes(
      "too many requests"
    )
  ) {
    return "Terlalu banyak percobaan. Silakan tunggu beberapa saat.";
  }

  if (
    message.includes(
      "network"
    )
  ) {
    return "Koneksi internet bermasalah.";
  }

  return (
    error?.message ||
    "Login gagal. Silakan coba lagi."
  );
}


/* =========================
   17. CHECK SESSION
   ========================= */

async function checkSession() {

  if (!db) {

    showLogin();

    setAuthMessage(
      "Supabase belum dikonfigurasi. Masukkan Publishable Key terlebih dahulu.",
      "error"
    );

    return;
  }

  try {

    const {
      data,
      error
    } = await db.auth.getSession();

    if (error) {

      console.error(
        "Session error:",
        error
      );

      showLogin();

      setAuthMessage(
        "Tidak dapat memeriksa sesi login.",
        "error"
      );

      return;
    }

    const session =
      data?.session;

    if (session?.user) {

      currentUser =
        session.user;

      showApp();

      await loadModules();

    } else {

      currentUser = null;

      showLogin();
    }

  } catch (error) {

    console.error(
      "checkSession error:",
      error
    );

    showLogin();

    setAuthMessage(
      "Terjadi kesalahan saat memeriksa login.",
      "error"
    );
  }
}


/* =========================
   18. AUTH STATE LISTENER
   ========================= */

function setupAuthListener() {

  if (!db) return;

  db.auth.onAuthStateChange(
    async (event, session) => {

      console.log(
        "Auth event:",
        event
      );

      if (
        event === "SIGNED_IN" &&
        session?.user
      ) {

        currentUser =
          session.user;

        showApp();

        /*
          Delay kecil supaya tidak bentrok
          dengan proses Auth Supabase.
        */
        setTimeout(
          () => {
            loadModules();
          },
          0
        );

      }

      if (
        event === "SIGNED_OUT"
      ) {

        currentUser = null;

        modules = [];

        showLogin();
      }
    }
  );
}


/* =========================
   19. LOGIN FORM
   ========================= */

function setupLoginForm() {

  const form =
    $("loginForm");

  if (!form) return;

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const email =
        $("email")?.value || "";

      const password =
        $("password")?.value || "";

      if (!email.trim()) {

        setAuthMessage(
          "Email wajib diisi.",
          "error"
        );

        return;
      }

      if (!password) {

        setAuthMessage(
          "Password wajib diisi.",
          "error"
        );

        return;
      }

      await login(
        email,
        password
      );
    }
  );
}


/* =========================
   20. LOGOUT BUTTON
   ========================= */

function setupLogout() {

  const button =
    $("logoutBtn");

  if (!button) return;

  button.addEventListener(
    "click",
    logout
  );
}


/* =========================
   21. SEARCH
   ========================= */

function setupSearch() {

  const input =
    $("search");

  if (!input) return;

  input.addEventListener(
    "input",
    () => {
      searchModules(
        input.value
      );
    }
  );
}


/* =========================
   22. START BUTTON
   ========================= */

function setupStartButton() {

  const button =
    $("startBtn");

  if (!button) return;

  button.addEventListener(
    "click",
    () => {

      const section =
        $("modulesSection");

      if (!section) return;

      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  );
}


/* =========================
   23. START APPLICATION
   ========================= */

async function initApp() {

  console.log(
    "RARA ACADEMY starting..."
  );

  /*
    Cek apakah Publishable Key
    masih berupa placeholder.
  */

  if (
    !SUPABASE_PUBLISHABLE_KEY ||
    SUPABASE_PUBLISHABLE_KEY.includes(
      "PASTE_YOUR_SUPABASE"
    )
  ) {

    console.warn(
      "Supabase Publishable Key belum diisi."
    );

    showLogin();

    setAuthMessage(
      "Supabase belum dikonfigurasi. Masukkan Publishable Key pada app.js.",
      "error"
    );

  } else {

    setupAuthListener();

    await checkSession();
  }

  setupLoginForm();
  setupLogout();
  setupSearch();
  setupStartButton();

  console.log(
    "RARA ACADEMY ready."
  );
}


/* =========================
   24. START
   ========================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initApp
  );

} else {

  initApp();
}
