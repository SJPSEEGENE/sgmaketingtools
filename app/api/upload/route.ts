import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
async function isAdmin(userId:string){
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from('profiles').select('role,status').eq('id',userId).single();
  return data?.role === 'admin' && data?.status === 'approved';
}
export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const form = await req.formData();
  const userId = String(form.get('userId') || '');
  if (!(await isAdmin(userId))) return NextResponse.json({ error:'forbidden' }, { status:403 });
  const file = form.get('file') as File | null;
  const category = String(form.get('category') || '');
  const product_name = String(form.get('product_name') || '');
  const material_type = String(form.get('material_type') || '');
  const title = String(form.get('title') || `${product_name} ${material_type}`);
  if (!file || !category || !product_name || !material_type) return NextResponse.json({ error:'missing fields' }, { status:400 });
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
  const path = `${category}/${product_name}/${material_type}/${Date.now()}_${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabaseAdmin.storage.from('marketing-materials').upload(path, buffer, { contentType: file.type, upsert: true });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status:500 });
  const { data: pub } = supabaseAdmin.storage.from('marketing-materials').getPublicUrl(path);
  const { data, error } = await supabaseAdmin.from('marketing_materials').insert({ category, product_name, material_type, title, file_url: pub.publicUrl, storage_path: path, file_name: file.name, file_type: file.type, created_by: userId }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status:500 });
  return NextResponse.json({ material: data });
}
