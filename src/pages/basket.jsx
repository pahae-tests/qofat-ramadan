import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Plus, Trash2, Pencil, X, Check, Package, Loader2, ChevronDown, DirhamSign, ShoppingBasket, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const d = (isDark, light, drk) => isDark ? drk : light;

// Moroccan basket emoji items for visual decoration
const ITEM_ICONS = ['🌾', '🍖', '🍚', '🥯', '🧀', '🥜', '🍯', '🧂', '☕', '🧃', '🥫', '🥚'];

export default function BasketPage({ dark }) {
  const [year, setYear]         = useState(CURRENT_YEAR);
  const [basket, setBasket]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  // Editor state
  const [editItems, setEditItems]   = useState([]);
  const [editAmount, setEditAmount] = useState('');
  const [newItem, setNewItem]       = useState('');
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState('');

  // Tokens
  const bg      = d(dark, 'bg-white',         'bg-slate-900');
  const bg2     = d(dark, 'bg-slate-50',      'bg-slate-800');
  const pageBg  = d(dark, 'bg-slate-100',     'bg-slate-950');
  const border  = d(dark, 'border-slate-200', 'border-slate-700');
  const border2 = d(dark, 'border-slate-100', 'border-slate-800');
  const text1   = d(dark, 'text-slate-900',   'text-slate-100');
  const text2   = d(dark, 'text-slate-600',   'text-slate-300');
  const text3   = d(dark, 'text-slate-400',   'text-slate-500');
  const inputCls = d(dark, 'bg-white border-slate-200 text-slate-900 placeholder-slate-400', 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500');

  const fetchBasket = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/basket/get?year=${year}`);
      const data = await res.json();
      setBasket(data);
    } catch { setBasket(null); }
    setLoading(false);
  }, [year]);

  useEffect(() => { fetchBasket(); }, [fetchBasket]);

  const openEditor = () => {
    setEditItems(basket?.items ? [...basket.items] : []);
    setEditAmount(basket?.amount != null ? String(basket.amount) : '');
    setNewItem('');
    setSaveError('');
    setShowEditor(true);
  };

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    setEditItems(prev => [...prev, trimmed]);
    setNewItem('');
  };

  const removeItem = (idx) => setEditItems(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/basket/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          items: editItems,
          amount: editAmount !== '' ? Number(editAmount) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error || 'حدث خطأ'); setSaving(false); return; }
      setBasket(data);
      setShowEditor(false);
    } catch {
      setSaveError('تعذر الاتصال بالخادم');
    }
    setSaving(false);
  };

  const hasBasket = basket && basket.items && basket.items.length > 0;

  return (
    <>
      <Head>
        <title>القفة الرمضانية — مكونات {year}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div dir="rtl" className={`min-h-screen ${pageBg} transition-colors duration-300`}
        style={{ fontFamily: "'Cairo', sans-serif" }}>

        {/* ── PAGE HERO ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-orange-900 to-amber-800">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
          <div className="absolute bottom-0 left-10 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
          {/* Geometric pattern overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

          <div className="relative max-w-screen-xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 bg-opacity-25 flex items-center justify-center ring-1 ring-amber-400 ring-opacity-40">
                  <ShoppingBasket size={20} className="text-white" />
                </div>
                <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">القفة الرمضانية</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                مكونات <span className="text-amber-300">القفة</span>
              </h1>
              <p className="text-sm text-amber-200 text-opacity-70 mt-1 font-medium">
                محتويات القفة الرمضانية المخصصة للأسر المحتاجة
              </p>
            </div>

            {/* Year selector */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select value={year} onChange={e => setYear(Number(e.target.value))}
                  className="pl-8 pr-4 py-2.5 rounded-xl bg-white bg-opacity-15 border border-white border-opacity-25 text-black text-sm font-bold cursor-pointer outline-none backdrop-blur-sm hover:bg-opacity-20 transition-all"
                  style={{ fontFamily: 'inherit' }}>
                  {YEARS.map(y => <option key={y} value={y} style={{ background: '#1e293b', color: '#fff' }}>{y}</option>)}
                </select>
                <ChevronDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white opacity-70 pointer-events-none" />
              </div>
              <button type="button" onClick={openEditor}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-sm font-black active:scale-95 transition-all shadow-lg shadow-amber-900/40"
                style={{ fontFamily: 'inherit' }}>
                <Pencil size={14} />
                {hasBasket ? 'تعديل القفة' : 'إنشاء القفة'}
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <main className="max-w-screen-xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
              <p className={`${text3} text-sm`}>جارٍ التحميل...</p>
            </div>
          ) : !hasBasket ? (
            /* ── EMPTY STATE ── */
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className={`w-24 h-24 rounded-3xl ${bg2} border ${border} flex items-center justify-center mb-6 shadow-inner`}>
                <ShoppingBasket size={40} className={text3} />
              </div>
              <h2 className={`text-xl font-bold ${text1} mb-2`}>لا توجد قفة لسنة {year}</h2>
              <p className={`text-sm ${text3} max-w-xs mb-6`}>
                لم يتم تحديد مكونات القفة الرمضانية لهذه السنة بعد. يمكنك إنشاؤها الآن.
              </p>
              <button type="button" onClick={openEditor}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold active:scale-95 transition-all shadow-lg"
                style={{ fontFamily: 'inherit' }}>
                <Plus size={16} />
                إنشاء قفة {year}
              </button>
            </div>
          ) : (
            /* ── BASKET DISPLAY ── */
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* LEFT — Items list */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-2xl font-black ${text1}`}>مكونات قفة {year}</h2>
                    <p className={`text-sm ${text3} mt-0.5`}>{basket.items.length} مادة غذائية</p>
                  </div>
                  {basket.amount != null && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                      <span className="text-white text-xs font-semibold opacity-80">المبلغ الإجمالي</span>
                      <span className="text-white font-black text-lg leading-none">{basket.amount.toLocaleString('ar-MA')}</span>
                      <span className="text-white text-xs font-bold opacity-80">د.م</span>
                    </div>
                  )}
                </div>

                {/* Items grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {basket.items.map((item, idx) => {
                    const icon = ITEM_ICONS[idx % ITEM_ICONS.length];
                    return (
                      <div key={idx}
                        className={`group flex items-center gap-4 px-4 py-4 rounded-2xl ${bg} border ${border} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                        style={{ animation: `fadeUp .35s ease both`, animationDelay: `${idx * 50}ms` }}>
                        {/* Number badge */}
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/30">
                          <span className="text-white font-black text-sm leading-none">{idx + 1}</span>
                        </div>
                        {/* Emoji */}
                        <span className="text-2xl flex-shrink-0 select-none">{icon}</span>
                        {/* Name */}
                        <span className={`font-bold ${text1} text-sm flex-1`}>{item}</span>
                        {/* Subtle line accent */}
                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-400 to-orange-400 opacity-40 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>

                {/* Footer note */}
                <div className={`mt-6 flex items-center gap-3 px-4 py-3 rounded-xl border ${border2} ${bg2}`}>
                  <Sparkles size={14} className="text-amber-500 flex-shrink-0" />
                  <p className={`text-xs ${text2} leading-relaxed`}>
                    تُوزَّع هذه المواد على الأسر المستفيدة خلال شهر رمضان المبارك لسنة {year}م
                  </p>
                </div>
              </div>

              {/* RIGHT — Basket image */}
              <div className="w-full lg:w-96 xl:w-[440px] flex-shrink-0">
                <div className={`sticky top-24 rounded-3xl overflow-hidden border ${border} shadow-2xl`}
                  style={{ background: dark ? 'linear-gradient(135deg,#1e293b,#0f172a)' : 'linear-gradient(135deg,#fffbeb,#fef3c7)' }}>
                  {/* Image area */}
                  <div className="relative aspect-square">
                    <img src="/basket.png" alt="القفة الرمضانية"
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                    {/* Fallback if no image */}
                    <div className="hidden w-full h-full items-center justify-center" style={{ display: 'none' }}>
                      <div className="text-center">
                        <div className="text-8xl mb-4">🧺</div>
                        <p className={`text-sm font-semibold ${text3}`}>القفة الرمضانية</p>
                      </div>
                    </div>
                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
                      style={{ background: dark ? 'linear-gradient(to top, #0f172a, transparent)' : 'linear-gradient(to top, #fef3c7, transparent)' }} />
                  </div>

                  {/* Card footer */}
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-bold ${text3} uppercase tracking-widest`}>القفة الرمضانية</p>
                        <p className={`text-2xl font-black ${text1} mt-0.5`}>{year}م</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${text3}`}>عدد المواد</p>
                        <p className="text-3xl font-black text-amber-500 leading-none">{basket.items.length}</p>
                      </div>
                    </div>
                    {basket.amount != null && (
                      <div className={`mt-4 pt-4 border-t ${border2} flex items-center justify-between`}>
                        <span className={`text-xs font-semibold ${text3}`}>القيمة التقديرية للقفة</span>
                        <span className="text-lg font-black text-emerald-500">{basket.amount.toLocaleString('ar-MA')} <span className="text-sm">د.م</span></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ══ EDITOR DRAWER ══ */}
        {showEditor && (
          <div className="fixed inset-0 z-[200] flex"
            style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}
            onClick={() => setShowEditor(false)}>
            <div className="flex-1 bg-opacity-50 cursor-pointer" />
            <div className={`w-full lg:w-[520px] ${bg} h-full overflow-y-auto shadow-2xl flex flex-col`}
              style={{ animation: 'slideIn .28s cubic-bezier(.4,0,.2,1)' }}
              onClick={e => e.stopPropagation()}>

              {/* Drawer header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-600 px-6 py-5 flex-shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-5 -translate-y-1/2 translate-x-1/3" />
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center">
                      <Package size={18} className="text-orange-600" />
                    </div>
                    <div>
                      <h2 className="font-black text-white text-base">تعديل قفة {year}</h2>
                      <p className="text-amber-200 text-xs">أضف أو احذف المواد الغذائية</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowEditor(false)}
                    className="p-2 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 cursor-pointer transition-all border-0">
                    <X size={16} className="text-black font-bold" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-6">

                {/* Items section */}
                <div>
                  <label className={`block text-xs font-black ${text2} mb-3 tracking-widest uppercase`}>
                    المواد الغذائية
                    <span className={`mr-2 font-semibold ${text3} normal-case tracking-normal`}>
                      ({editItems.length} مادة)
                    </span>
                  </label>

                  {/* Add new item */}
                  <div className="flex gap-2 mb-4">
                    <input type="text"
                      placeholder="مثال: زيت الزيتون، سكر، دقيق..."
                      value={newItem}
                      onChange={e => setNewItem(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                      className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
                      style={{ fontFamily: 'inherit' }}
                      onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,.15)'; }}
                      onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
                    <button type="button" onClick={addItem}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold cursor-pointer border-0 active:scale-95 transition-all flex-shrink-0 shadow-md shadow-amber-500/30"
                      style={{ fontFamily: 'inherit' }}>
                      <Plus size={16} />
                      إضافة
                    </button>
                  </div>

                  {/* Items list */}
                  {editItems.length === 0 ? (
                    <div className={`py-10 text-center rounded-2xl border-2 border-dashed ${border}`}>
                      <div className='w-full flex justify-center items-center'>
                        <ShoppingBag size={18} className={`text-sm ${text3}`} />
                      </div>
                      <p className={`text-sm ${text3}`}>لا توجد مواد بعد، ابدأ بالإضافة</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {editItems.map((item, idx) => {
                        const icon = ITEM_ICONS[idx % ITEM_ICONS.length];
                        return (
                          <div key={idx}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${border2} ${bg2} group`}>
                            <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-black flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-lg flex-shrink-0">{icon}</span>
                            <span className={`flex-1 text-sm font-semibold ${text1}`}>{item}</span>
                            <button type="button" onClick={() => removeItem(idx)}
                              className={`p-1.5 rounded-lg border cursor-pointer transition-all opacity-0 group-hover:opacity-100 ${d(dark,'border-red-200 bg-red-50 text-red-500 hover:bg-red-100','border-red-800 bg-red-900 text-red-400 hover:bg-red-800')}`}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Amount section */}
                <div className={`rounded-2xl border ${border} overflow-hidden`}>
                  <div className={`flex items-center gap-2 px-4 py-3 border-b ${border2} ${bg2}`}>
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 text-xs font-black">م</span>
                    </div>
                    <span className={`text-xs font-black ${text1} tracking-wide`}>القيمة التقديرية للقفة</span>
                    <span className={`text-xs ${text3} font-medium`}>(اختياري)</span>
                  </div>
                  <div className="p-4">
                    <div className="relative">
                      <input type="number" min="0" step="0.01"
                        placeholder="مثال: 350"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                        className={`w-full pr-4 pl-16 py-3 rounded-xl border text-sm font-bold outline-none transition-all ${inputCls}`}
                        style={{ fontFamily: 'inherit' }}
                        onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,.15)'; }}
                        onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
                      <div className={`absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center rounded-r-xl border-r-0 border ${border} font-bold text-sm ${d(dark,'bg-slate-100 text-slate-500 border-slate-200','bg-slate-700 text-slate-400 border-slate-600')}`}
                        style={{ borderRadius: '0 12px 12px 0', borderRight: 'none' }}>
                        د.م
                      </div>
                    </div>
                    {editAmount && (
                      <p className={`text-xs ${text3} mt-2 text-center`}>
                        القيمة: {Number(editAmount).toLocaleString('ar-MA')} درهم مغربي
                      </p>
                    )}
                  </div>
                </div>

                {saveError && (
                  <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${d(dark,'bg-red-50 border-red-200 text-red-700','bg-red-900 border-red-800 text-red-300')}`}>
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {saveError}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`flex gap-3 p-5 border-t ${border} flex-shrink-0 ${bg}`}>
                <button type="button" onClick={() => setShowEditor(false)}
                  className={`flex-1 py-3 rounded-xl cursor-pointer border ${border} ${bg2} text-sm font-bold ${text2} hover:opacity-80 transition-all`}
                  style={{ fontFamily: 'inherit' }}>
                  إلغاء
                </button>
                <button type="button" onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer border-0 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white text-sm font-black shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
                  style={{ fontFamily: 'inherit' }}>
                  {saving
                    ? <><Loader2 size={15} className="animate-spin" /> جارٍ الحفظ...</>
                    : <><Check size={15} /> حفظ القفة</>}
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
          * { font-family: 'Cairo', sans-serif !important; }
          select option { background: ${dark ? '#1e293b' : '#fff'}; color: ${dark ? '#e2e8f0' : '#0f172a'}; }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}