create table if not exists marketing_materials (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  product_name text not null,
  material_type text not null,
  title text not null,
  file_url text not null,
  storage_path text,
  file_type text,
  created_at timestamptz default now()
);

-- Supabase Dashboard > Storage 에서 marketing-materials 버킷을 public 으로 생성하세요.
