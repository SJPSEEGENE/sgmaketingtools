import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
async function isAdmin(userId:string){
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from('profiles').select('role,status').eq('id',userId).single();
  return data?.role === 'admin' && data?.status === 'approved';
}
export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const { userId, id } = await req.json();
  if (!(await isAdmin(userId))) return NextResponse.json({ error:'forbidden' }, { status:403 });
  const { data } = await supabaseAdmin.from('marketing_materials').select('storage_path').eq('id', id).single();
  if (data?.storage_path) await supabaseAdmin.storage.from('marketing-materials').remove([data.storage_path]);
  const { error } = await supabaseAdmin.from('marketing_materials').delete().eq('id', id);
  if (error) return NextResponse.json({ error:error.message }, { status:500 });
  return NextResponse.json({ ok:true });
}
