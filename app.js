/* =========================================
   RARA ACADEMY - APP.JS
   SUPABASE AUTH + MODULES
========================================= */

const SUPABASE_URL =
  "https://oajysgoeupdoonbempgz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_tBhLLkdy1XFacCWg-f8lNA_wKakcfJh";


/* =========================================
   SUPABASE CLIENT
========================================= */

let db = null;

try {
  if (!window.supabase) {
    throw new Error(
      "Supabase library belum dimuat."
    );
  }

  db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("SUPABASE CLIENT SIAP");

} catch (error) {

  console.error(
    "SUPABASE ERROR:",
    error
  );
}


/* =============================…
