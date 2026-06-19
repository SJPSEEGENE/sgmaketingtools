import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const { userId, email, name, department } = await req.json();
  if (!userId || !email) return NextResponse.json({ error: 'missing user' }, { status: 400 });
  const adminEmail = process.env.ADMIN_EMAIL;
  const isFirstAdmin = adminEmail && email.toLowerCase() === adminEmail.toLowerCase();
  const payload = {
    id: userId,
    email,
    name: name || null,
    department: department || null,
    status: isFirstAdmin ? 'approved' : 'pending',
    role: isFirstAdmin ? 'admin' : 'guest',
    approved_at: isFirstAdmin ? new Date().toISOString() : null
  };
  const { error } = await supabaseAdmin.from('profiles').upsert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
