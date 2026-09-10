/* =========================================
   RARA ACADEMY - APP.JS
   SUPABASE AUTH + MODULES
========================================= */

const SUPABASE_URL =
  "https://oajysgoeupdoonbempgz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_tBhLLkdy1XFacCWg-f8lNA_wKakcfJh";


/* =========================================
   SUPABASE
========================================= */

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* =========================================
   HELPER
========================================= */

const $ = (id) => document.getElementById(id);

let modules = [];


/* =========================================
   STATUS
========================================= */

function…
