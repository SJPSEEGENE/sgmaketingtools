import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const categoryMap: Record<string, string> = {
  '검사홍보': 'promo',
  '학술임상': 'academic',
  '영업제안': 'sales',
  '브랜드홍보': 'brand',
  'IT솔루션': 'it'
};

const typeMap: Record<string, string> = {
  '3단 리플렛': 'leaflet',
  '브로슈어': 'brochure',
  '뉴스레터': 'newsletter',
  '배너': 'banner',
  '탁상배너': 'table-banner',
  '포스터': 'poster',
  '1P 안내자료': 'one-page'
};

function safeSlug(value: string) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'item';
}

function safeExt(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : 'pdf';
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
    const ext = safeExt(file.name);

    const storage_path = [
      categoryMap[category] || safeSlug(category),
      safeSlug(product_name),
      typeMap[material_type] || safeSlug(material_type),
      `${Date.now()}.${ext}`
    ].join('/');

    const arrayBuffer = await file.arrayBuffer();

    const { error: upError } = await supabase.storage
      .from('marketing-materials')
      .upload(storage_path, Buffer.from(arrayBuffer), {
        contentType: file.type || 'application/octet-stream',
        upsert: true
      });

    if (upError) throw upError;

    const { data: pub } = supabase.storage
      .from('marketing-materials')
      .getPublicUrl(storage_path);

    const file_url = pub.publicUrl;

    const { data, error } = await supabase
      .from('marketing_materials')
      .insert({
        category,
        product_name,
        material_type,
        title,
        file_url,
        storage_path,
        file_type: file.type || `application/${ext}`
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ material: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '업로드 실패' }, { status: 500 });
  }
}
