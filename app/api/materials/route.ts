import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('marketing_materials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ materials: data || [] });
  } catch (e: any) {
    return NextResponse.json({ materials: [], error: e.message }, { status: 200 });
  }
}
