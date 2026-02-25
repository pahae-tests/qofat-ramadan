const d = (isDark, light, drk) => isDark ? drk : light;

export default function Footer({ dark }) {
  const border = d(dark, 'border-slate-200', 'border-slate-700');
  const text3  = d(dark, 'text-slate-400',   'text-slate-500');
  const bg2    = d(dark, 'bg-slate-50',      'bg-slate-800');

  return (
    <footer dir="rtl" className={`${bg2} border-t ${border} py-4 mt-8`}>
      <div className={`max-w-screen-xl mx-auto px-5 text-center text-xs ${text3}`}>
        © {new Date().getFullYear()} المجلس العلمي — المملكة المغربية
      </div>
    </footer>
  );
}