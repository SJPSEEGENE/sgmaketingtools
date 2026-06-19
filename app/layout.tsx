import './style.css';
export const metadata = { title: '씨젠의료재단 마케팅 포털', description: 'Seegene marketing materials dashboard' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
