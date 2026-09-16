-- AimVault V2 - Supabase schema
-- GitHub Pages hosts the frontend; Supabase provides the database and authentication.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.crosshairs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  image_url text,
  categories text[] not null default '{}',
  player text,
  is_pro boolean not null default false,
  tags text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crosshairs_categories_gin on public.crosshairs using gin(categories);
create index if not exists crosshairs_published_idx on public.crosshairs(published);
create index if not exists crosshairs_pro_idx on public.crosshairs(is_pro);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists crosshairs_updated_at on public.crosshairs;
create trigger crosshairs_updated_at before update on public.crosshairs
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.crosshairs enable row level security;

drop policy if exists "admins can read own admin row" on public.admin_users;
create policy "admins can read own admin row" on public.admin_users
for select to authenticated using (user_id = auth.uid());

drop policy if exists "public can read published crosshairs" on public.crosshairs;
create policy "public can read published crosshairs" on public.crosshairs
for select to anon, authenticated using (published = true or public.is_admin());

drop policy if exists "admins can insert crosshairs" on public.crosshairs;
create policy "admins can insert crosshairs" on public.crosshairs
for insert to authenticated with check (public.is_admin());

drop policy if exists "admins can update crosshairs" on public.crosshairs;
create policy "admins can update crosshairs" on public.crosshairs
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins can delete crosshairs" on public.crosshairs;
create policy "admins can delete crosshairs" on public.crosshairs
for delete to authenticated using (public.is_admin());

-- Images are stored as normal URLs in public.crosshairs.image_url.
-- Supabase Storage is intentionally not used.

-- Existing AimVault entries. Run once after creating the tables.
insert into public.crosshairs (name,code,image_url,categories,player,is_pro,published,created_at)
values
('Green Precision','0;P;c;1;h;0;f;0;0l;2;0o;1;0a;1;0f;0;1b;0','https://cdn.phototourl.com/free/2026-09-06-f815dbc4-0644-4cf6-81e0-987c67df4655.png',ARRAY['other'],'',false,true,'2026-09-06'),
('Shuriken','0;P;c;7;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1t;8;1l;1;1o;1;1a;1;1m;0;1f;0','https://cdn.phototourl.com/free/2026-09-06-ef24e720-2551-4c18-be64-45cca27b061b.png',ARRAY['other'],'',false,true,'2026-09-06'),
('Sakura','0;P;c;8;u;F97AC0FF;o;0.1;b;1;m;1;0t;3;0l;3;0o;1;0a;1;0f;0;1t;1;1l;5;1o;0;1a;0.8;1m;0;1e;0.1','https://cdn.phototourl.com/free/2026-09-06-3ecdacb9-c928-43bd-8663-2fbf24a24d96.png',ARRAY['funny'],'',false,true,'2026-09-06'),
('Pink X','0;s;1;P;c;8;u;F8B5E8FF;h;0;d;1;b;1;f;0;0t;6;0l;1;0o;1;0a;1;0f;0;1v;0;1g;1;1o;6;1a;1;1m;0;1f;0;S;c;0;s;0.75;o;1','https://cdn.phototourl.com/free/2026-09-06-7ff17a57-5a9d-44fd-8bcd-83303f1df32e.png',ARRAY['funny'],'',false,true,'2026-09-06'),
('Star of David','0;P;c;8;u;000000FF;h;0;b;1;0t;8;0l;0;0v;1;0g;1;0o;1;0a;1;0f;0;1v;3;1g;1;1o;1;1a;1;1m;0;1f;0','https://cdn.phototourl.com/free/2026-09-09-5840df0b-3408-47ec-bda3-06295e3d3ffa.png',ARRAY['funny'],'',false,true,'2026-09-06'),
('TenZ','0;s;1;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;0f;0;1b;0;S;c;4;o;1','https://cdn.phototourl.com/free/2026-08-31-8beddda9-408d-4ff3-b5d0-b315f5d99cf5.png',ARRAY['pro','small','minimalist'],'TenZ',true,true,'2026-09-06'),
('small dot','0;P;d;1;f;0;0t;4;0l;1;0o;0;0a;1;0f;0;1b;0','https://cdn.phototourl.com/free/2026-09-02-fe0e12b1-537a-4a3e-8d9d-f0c54e6c2863.png',ARRAY['pro','dot','small','minimalist'],'',true,true,'2026-09-06'),
('Aim bot','0;s;1;P;o;0.1;f;0;s;0;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0','https://cdn.phototourl.com/free/2026-09-03-4de9ed7e-e591-4c5f-aaba-813fc6de20e0.png',ARRAY['pro','minimalist'],'',true,true,'2026-09-06'),
('nAts','0;P;h;0;f;0;0t;1;0l;3;0o;1;0a;1;0f;0;1b;0','https://cdn.phototourl.com/free/2026-09-06-7baf8626-9006-420a-aeac-97cb4e1c047b.png',ARRAY['pro'],'nAts',true,true,'2026-09-06'),
('Cyan Dot','0;P;c;5;o;1;d;1;0l;1;0o;1;0a;1;0f;0;1b;0','https://cdn.phototourl.com/free/2026-09-06-619f8760-3645-4877-a755-af19560355a3.png',ARRAY['pro','dot','cyan'],'',true,true,'2026-09-06'),
('Classic White','0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0','https://cdn.phototourl.com/free/2026-09-06-6aa7b586-373f-4d9e-9515-809270a5ca6f.png',ARRAY['other','minimalist'],'',false,true,'2026-09-06'),
('underrated cyan','0;s;1;P;c;5;o;0;f;0;0l;2;0v;2;0g;1;0o;1;0a;1;0f;0;1b;0;S;o;0.8','https://cdn.phototourl.com/free/2026-09-09-618a7877-6e89-40ec-97b4-d9c8da59b4f6.png',ARRAY['teams','cyan'],'',false,true,'2026-09-06'),
('Tiny White Dot','0;P;h;0;d;1;0b;0;1b;0','https://cdn.phototourl.com/free/2026-09-06-95345a83-4fc7-4920-a5a0-83924ae44198.png',ARRAY['pro','dot','small','minimalist'],'',true,true,'2026-09-06')
on conflict do nothing;


-- ADMIN SETUP (run this AFTER creating your admin user in Supabase Authentication > Users)
-- Replace YOUR_AUTH_USER_UUID with that user's UUID, then run the statement below.
-- insert into public.admin_users (user_id) values ('YOUR_AUTH_USER_UUID'::uuid) on conflict do nothing;
