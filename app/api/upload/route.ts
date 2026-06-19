import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic';

function safeName(v: string) {
  return v.replace(/[\\/:*?"<>|#%&{}$!'@+`=]/g, '_').replace(/\s+/g, '_');
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const category = String(form.get('category') || '검사홍보');
    const product_name = String(form.get('product_name') || '').trim();
    const material_type = String(form.get('material_type') || '').trim();
    const title = String(form.get('title') || `${product_name} ${material_type}`).trim();
    const file = form.get('file') as File | null;
    if (!product_name || !material_type || !file) {
      return NextResponse.json({ error: '필수값이 누락되었습니다.' }, { status: 400 });
    }
    const supabase = getAdminSupabase();
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'pdf';
    const storage_path = `${safeName(category)}/${safeName(product_name)}/${safeName(material_type)}/${Date.now()}_${safeName(file.name)}`;
    const arrayBuffer = await file.arrayBuffer();
    const { error: upError } = await supabase.storage
      .from('marketing-materials')
      .upload(storage_path, Buffer.from(arrayBuffer), {
        contentType: file.type || 'application/octet-stream',
        upsert: false
      });
    if (upError) throw upError;
    const { data: pub } = supabase.storage.from('marketing-materials').getPublicUrl(storage_path);
    const file_url = pub.publicUrl;
    const { data, error } = await supabase.from('marketing_materials').insert({
      category, product_name, material_type, title, file_url, storage_path, file_type: file.type || `application/${ext}`
    }).select('*').single();
    if (error) throw error;
    return NextResponse.json({ material: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '업로드 실패' }, { status: 500 });
  }
}
