// ================================
// RARA ACADEMY - SUPABASE CONFIG
// Ganti 2 nilai di bawah dengan data dari project Supabase kamu.
// Gunakan ANON/PUBLISHABLE KEY, JANGAN gunakan service_role key.
// ================================
const SUPABASE_URL = "PASTE_SUPABASE_URL_DI_SINI";
const SUPABASE_ANON_KEY = "PASTE_SUPABASE_ANON_KEY_DI_SINI";

const { createClient } = window.supabase;
const isConfigured = !SUPABASE_URL.includes("PASTE_") && !SUPABASE_ANON_KEY.includes("PASTE_");
const supabaseClient = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const landing = document.getElementById("landing");
const auth = document.getElementById("auth");
const dashboard = document.getElementById("dashboard");
const logoutBtn = document.getElementById("logoutBtn");
const startBtn = document.getElementById("startBtn");
const authForm = document.getElementById("authForm");
const toggleAuth = document.getElementById("toggleAuth");
const authTitle = document.getElementById("authTitle");
const authInfo = document.getElementById("authInfo");
const authSubmit = document.getElementById("authSubmit");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const loading = document.getElementById("loading");

let isRegister = false;

function setLoading(value){ loading.classList.toggle("hidden", !value); }

function showMessage(text, error=false){
  message.textContent = text;
  message.style.color = error ? "#b42318" : "#087443";
}

function showAuth(){
  landing.classList.add("hidden");
  dashboard.classList.add("hidden");
  auth.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
}

function showDashboard(profileName, email){
  landing.classList.add("hidden");
  auth.classList.add("hidden");
  dashboard.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  userName.textContent = profileName || email?.split("@")[0] || "Teman";
}

function showLanding(){
  landing.classList.remove("hidden");
  auth.classList.add("hidden");
  dashboard.classList.add("hidden");
  logoutBtn.classList.add("hidden");
}

startBtn.addEventListener("click", showAuth);

toggleAuth.addEventListener("click", ()=>{
  isRegister = !isRegister;
  nameInput.classList.toggle("hidden", !isRegister);
  authTitle.textContent = isRegister ? "Buat Akun RARA ACADEMY" : "Masuk ke RARA ACADEMY";
  authInfo.textContent = isRegister ? "Daftar untuk mulai belajar." : "Gunakan akun kamu untuk masuk.";
  authSubmit.textContent = isRegister ? "Daftar" : "Masuk";
  toggleAuth.textContent = isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar";
  showMessage("");
});

authForm.addEventListener("submit", async (e)=>{
  e.preventDefault();

  if(!isConfigured){
    showMessage("Website belum terhubung. Isi SUPABASE_URL dan SUPABASE_ANON_KEY di app.js.", true);
    return;
  }

  setLoading(true);
  showMessage("");

  try{
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if(isRegister){
      const name = nameInput.value.trim();
      if(!name){ showMessage("Nama lengkap wajib diisi.", true); return; }

      const { data, error } = await supabaseClient.auth.signUp({
        email, password,
        options:{ data:{ full_name:name } }
      });
      if(error) throw error;

      if(data.user){
        const { error: profileError } = await supabaseClient
          .from("profiles")
          .upsert({ id:data.user.id, full_name:name }, { onConflict:"id" });
        if(profileError) console.warn("Profile belum tersimpan:", profileError);
      }

      showMessage("Pendaftaran berhasil. Jika diminta, cek email untuk verifikasi.");
      isRegister = false;
      nameInput.classList.add("hidden");
      authTitle.textContent = "Masuk ke RARA ACADEMY";
      authSubmit.textContent = "Masuk";
      toggleAuth.textContent = "Belum punya akun? Daftar";
    }else{
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if(error) throw error;
      await loadUser();
    }
  }catch(err){
    showMessage(err.message || "Terjadi kesalahan.", true);
  }finally{
    setLoading(false);
  }
});

logoutBtn.addEventListener("click", async ()=>{
  if(!supabaseClient) return;
  await supabaseClient.auth.signOut();
  showLanding();
});

async function loadUser(){
  if(!supabaseClient) return;
  const { data:{ user } } = await supabaseClient.auth.getUser();
  if(!user){ showLanding(); return; }

  let name = user.user_metadata?.full_name || "";

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if(profile?.full_name) name = profile.full_name;
  showDashboard(name, user.email);
}

async function init(){
  if(!isConfigured){
    showLanding();
    return;
  }

  const { data:{ session } } = await supabaseClient.auth.getSession();
  if(session) await loadUser();
  else showLanding();

  supabaseClient.auth.onAuthStateChange((_event, session)=>{
    if(session) loadUser();
    else showLanding();
  });
}

function showComingSoon(){
  alert("Halaman materi sedang disiapkan. Struktur website sudah siap untuk dikembangkan.");
}

init();
