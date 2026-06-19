-- 1) profiles: 회원/권한 관리
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  department text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  role text not null default 'guest' check (role in ('admin','employee','guest')),
  created_at timestamptz default now(),
  approved_at timestamptz
);

-- 2) marketing_materials: 자료 목록 관리
create table if not exists marketing_materials (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  product_name text not null,
  material_type text not null,
  title text not null,
  file_url text not null,
  storage_path text not null,
  file_name text,
  file_type text,
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table marketing_materials enable row level security;

-- profiles: 본인은 본인 프로필 조회 가능
drop policy if exists "profiles select own" on profiles;
create policy "profiles select own" on profiles for select using (auth.uid() = id);
drop policy if exists "profiles insert own" on profiles;
create policy "profiles insert own" on profiles for insert with check (auth.uid() = id);

-- materials: 승인 사용자는 활성 자료 조회 가능
drop policy if exists "approved users can view materials" on marketing_materials;
create policy "approved users can view materials" on marketing_materials
for select using (
  is_active = true and exists (select 1 from profiles p where p.id = auth.uid() and p.status = 'approved')
);

-- Storage bucket 생성은 Dashboard > Storage에서 marketing-materials 로 직접 생성 권장
