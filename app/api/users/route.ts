import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
async function isAdmin(userId:string){
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from('profiles').select('role,status').eq('id',userId).single();
  return data?.role === 'admin' && data?.status === 'approved';
}
export async function GET(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const userId = new URL(req.url).searchParams.get('userId') || '';
  if (!(await isAdmin(userId))) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at',{ascending:false});
  if (error) return NextResponse.json({ error:error.message }, { status:500 });
  return NextResponse.json({ users:data });
}
export async function PATCH(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const { adminId, targetId, role, status } = await req.json();
  if (!(await isAdmin(adminId))) return NextResponse.json({ error:'forbidden' }, { status:403 });
  const { error } = await supabaseAdmin.from('profiles').update({ role, status, approved_at: status==='approved' ? new Date().toISOString() : null }).eq('id', targetId);
  if (error) return NextResponse.json({ error:error.message }, { status:500 });
  return NextResponse.json({ ok:true });
}
