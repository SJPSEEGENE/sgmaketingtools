# 씨젠의료재단 마케팅 대시보드

## 배포 전 필수 설정
Vercel Environment Variables에 아래 3개를 등록하세요.

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## Supabase 필수 작업
1. Supabase SQL Editor에서 `supabase/schema.sql` 실행
2. Storage에서 `marketing-materials` bucket 생성
3. bucket은 Public으로 생성 권장

## GitHub 업로드
이 폴더 안의 파일 전체를 GitHub 저장소 루트에 업로드하세요.
`seegene-final` 폴더째 올리지 말고, 내부 파일이 루트에 보여야 합니다.
