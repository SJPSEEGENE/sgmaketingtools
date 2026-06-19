# 씨젠의료재단 마케팅 포털 - Supabase 단독 운영형

## 기능
- 회원가입 신청
- 승인대기/승인/거절
- 등급: 관리자 / 직원 / 게스트
- 관리자: 자료 업로드/삭제, 회원 승인/등급 변경
- 직원: PDF 보기 + 다운로드
- 게스트: PDF 보기만 가능
- Supabase Storage + Database만 사용
- Vercel 배포

## Supabase 준비
1. SQL Editor에서 `supabase/schema.sql` 실행
2. Storage에서 bucket 생성: `marketing-materials`
3. bucket은 Public으로 생성 권장
4. 최초 관리자 계정 이메일은 Vercel 환경변수 `ADMIN_EMAIL`에 입력

## Vercel 환경변수
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_EMAIL

## 최초 관리자 생성
1. 사이트에서 ADMIN_EMAIL과 동일한 이메일로 회원가입
2. 자동으로 admin + approved 처리됨
