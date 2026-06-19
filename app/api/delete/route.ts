import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id 누락' }, { status: 400 });
    const supabase = getAdminSupabase();
    const { data: row, error: findError } = await supabase.from('marketing_materials').select('*').eq('id', id).single();
    if (findError) throw findError;
    if (row?.storage_path) await supabase.storage.from('marketing-materials').remove([row.storage_path]);
    const { error } = await supabase.from('marketing_materials').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '삭제 실패' }, { status: 500 });
  }
}
