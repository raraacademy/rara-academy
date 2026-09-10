const SUPABASE_URL="https://oajysgoeupdoonbempgz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY="sb_publishable_tBhLLkdy1XFacCWg-f8lNA_wKakcfJh";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
const $=id=>document.getElementById(id);
let modules=[];

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

async function loadModules(){
  $("status").textContent="Memuat materi...";
  const {data,error}=await db.from("modules").select("id,module_number,title,is_published,is_locked").order("module_number",{ascending:true});
  if(error){$("status").textContent="Gagal mengambil materi.";return}
  modules=data||[];render();
}
function render(){
  const q=$("search").value.trim().toLowerCase();
  const rows=modules.filter(x=>(x.title||"").toLowerCase().includes(q));
  const available=rows.filter(x=>x.is_published===true&&!x.is_locked).length;
  $("heroCount").textContent=available;
  $("status").textContent=rows.length?`${rows.length} materi ditemukan`:"";
  $("empty").classList.toggle("hidden",rows.length>0);
  $("modules").innerHTML=rows.map(x=>{
    const open=x.is_published===true&&!x.is_locked;
    return `<article class="module ${open?"":"locked"}">
      <div class="cover"><span class="number">${String(x.module_number??"").padStart(2,"0")}</span><span class="badge">${open?"MODUL TERSEDIA":"TERKUNCI"}</span></div>
      <div class="body"><h4>${esc(x.title||"Tanpa judul")}</h4>
      <p>${open?"Materi siap dipelajari. Mulai dan tingkatkan kemampuanmu.":x.is_locked?"Materi ini masih terkunci.":"Materi belum dipublikasikan."}</p>
      <div class="link"><span>${open?"Mulai belajar":"Belum tersedia"}</span><b>${open?"→":"🔒"}</b></div></div>
    </article>`;
  }).join("");
}
$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();$("authMsg").textContent="";
  if(SUPABASE_PUBLISHABLE_KEY.includes("PASTE_")){$("authMsg").textContent="Masukkan Supabase Publishable Key di app.js terlebih dahulu.";return}
  const {error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
  if(error){$("authMsg").textContent=error.message;return}
  $("loginScreen").classList.add("hidden");$("app").classList.remove("hidden");await loadModules();
});
$("logoutBtn").addEventListener("click",async()=>{await db.auth.signOut();location.reload()});
$("search").addEventListener("input",render);
$("startBtn").addEventListener("click",()=>$("modulesSection").scrollIntoView({behavior:"smooth"}));
(async()=>{
  if(SUPABASE_PUBLISHABLE_KEY.includes("PASTE_"))return;
  const {data}=await db.auth.getSession();
  if(data.session){$("loginScreen").classList.add("hidden");$("app").classList.remove("hidden");await loadModules()}
})();
