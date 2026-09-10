-- RARA ACADEMY - dasar tabel profiles
-- Jalankan di Supabase > SQL Editor.
-- Jika tabel profiles SUDAH ada, jangan hapus data.
-- Sesuaikan jika struktur tabel kamu berbeda.

alter table public.profiles enable row level security;

create policy "Users can view own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
