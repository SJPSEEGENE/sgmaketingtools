# 씨젠의료재단 마케팅 포털 - 단일 관리자 버전

## 관리자 계정
- ID: `admin`
- PW: `admin1234`

## 기능
- 일반 사용자는 로그인 없이 자료 조회/다운로드 가능
- 관리자만 로그인 후 자료 업로드/삭제 가능
- 자료는 Supabase Storage에 저장
- 자료 목록은 Supabase `marketing_materials` 테이블에 저장
- 회원가입/승인/등급관리 제거

## Vercel 환경변수
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase 준비
1. SQL Editor에서 `supabase/supabase_schema.sql` 실행
2. Storage에서 `marketing-materials` 버킷 생성
3. 버킷은 Public으로 설정

## GitHub 업로드
루트에 아래가 보여야 합니다.
- app
- lib
- supabase
- package.json
- next.config.js
- tsconfig.json
