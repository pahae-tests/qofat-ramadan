import { Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/router';

const d = (isDark, light, drk) => isDark ? drk : light;

export default function Header({ dark, setDark }) {
  const bg = d(dark, 'bg-white', 'bg-slate-900');
  const border = d(dark, 'border-slate-200', 'border-slate-700');
  const text1 = d(dark, 'text-slate-800', 'text-slate-100');
  const text2 = d(dark, 'text-slate-600', 'text-slate-300');
  const text3 = d(dark, 'text-slate-400', 'text-slate-500');
  const bg2 = d(dark, 'bg-slate-50', 'bg-slate-800');

  const router = useRouter();

  const toggleDark = () => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  };

  return (
    <header
      dir='rtl'
      className={`sticky top-0 z-50 ${bg} border-b ${border} shadow-sm`}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-screen-xl mx-auto px-5 h-16 flex items-center gap-4">

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex-shrink-0">
            <img src="/logo.png" alt="شعار" className="w-full h-full object-cover"
              onError={e => e.target.style.display = 'none'} />
          </div>
          <div>
            <div className={`font-bold text-sm ${text1} leading-tight`}>المجلس العلمي</div>
            <div className="text-xs text-emerald-500 font-semibold">المملكة المغربية</div>
          </div>
        </div>

        <div className={`w-px h-8 ${d(dark, 'bg-slate-200', 'bg-slate-700')}`} />

        <nav className="flex-1 flex justify-center gap-1">
          {[
            { href: '/basket', label: '🛒 مكونات القفة' },
            { href: '/', label: '👥 لائحة المستفيدين' },
          ].map(({ href, label }) => {
            const active = router.pathname === href;

            return (
              <a
                key={href}
                href={href}
                style={{ textDecoration: 'none' }}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${active
                    ? `${d(dark, 'bg-emerald-50', 'bg-emerald-900')} text-emerald-600 ring-1 ${d(dark, 'ring-emerald-200', 'ring-emerald-700')}`
                    : `${text3} ${d(dark, 'hover:bg-slate-100', 'hover:bg-slate-800')}`
                  }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleDark}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl ${bg2} border ${border} cursor-pointer ${text2} text-xs font-semibold transition-all hover:opacity-80 select-none`}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          <span>{dark ? 'فاتح' : 'داكن'}</span>
        </button>

      </div>
    </header>
  );
}