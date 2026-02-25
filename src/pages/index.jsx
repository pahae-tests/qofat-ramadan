import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import {
  Plus, Trash2, Pencil, Download, Search, X,
  Users, ChevronDown, AlertCircle, Baby, Filter,
  Phone, CreditCard, StickyNote, Calendar, ChevronUp,
  TrendingUp, CheckCircle2, Clock, UserPlus, User,
  Tag, Loader2
} from 'lucide-react';

const CATEGORIES = ['الكل', 'الأرامل', 'المتخلى عنها زوجها', 'المطلقات', 'الأسر المعوزة'];
const ADD_CATEGORIES = ['الأسر المعوزة', 'المتخلى عنها زوجها', 'المطلقات', 'الأرامل'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const d = (isDark, light, drk) => isDark ? drk : light;

const ADD_CAT_CFG = {
  'الأسر المعوزة': { light: 'border-violet-400 bg-violet-50 text-violet-700', dark: 'border-violet-500 bg-violet-900 text-violet-200' },
  'المتخلى عنها زوجها': { light: 'border-rose-400 bg-rose-50 text-rose-700', dark: 'border-rose-500 bg-rose-900 text-rose-200' },
  'المطلقات': { light: 'border-amber-400 bg-amber-50 text-amber-700', dark: 'border-amber-500 bg-amber-900 text-amber-200' },
  'الأرامل': { light: 'border-sky-400 bg-sky-50 text-sky-700', dark: 'border-sky-500 bg-sky-900 text-sky-200' },
};

const CATEGORY_CONFIG = (dark) => ({
  'الكل': { pill: d(dark, 'bg-slate-100 text-slate-600', 'bg-slate-700 text-slate-200'), active: d(dark, 'bg-emerald-600 text-white shadow-lg shadow-emerald-400/50 ring-2 ring-slate-800', 'bg-emerald-600 text-white shadow-lg shadow-black/60 ring-2 ring-white') },
  'الأسر المعوزة': { pill: d(dark, 'bg-violet-100 text-violet-700', 'bg-violet-900 text-violet-200'), active: d(dark, 'bg-violet-600 text-white shadow-lg shadow-violet-400/50 ring-2 ring-slate-800', 'bg-violet-600 text-white shadow-lg shadow-black/60 ring-2 ring-white') },
  'المتخلى عنها زوجها': { pill: d(dark, 'bg-rose-100 text-rose-700', 'bg-rose-900 text-rose-200'), active: d(dark, 'bg-rose-600 text-white shadow-lg shadow-rose-400/50 ring-2 ring-slate-800', 'bg-rose-600 text-white shadow-lg shadow-black/60 ring-2 ring-white') },
  'المطلقات': { pill: d(dark, 'bg-amber-100 text-amber-700', 'bg-amber-900 text-amber-200'), active: d(dark, 'bg-amber-500 text-white shadow-lg shadow-amber-400/50 ring-2 ring-slate-800', 'bg-amber-500 text-white shadow-lg shadow-black/60 ring-2 ring-white') },
  'الأرامل': { pill: d(dark, 'bg-sky-100 text-sky-700', 'bg-sky-900 text-sky-200'), active: d(dark, 'bg-sky-600 text-white shadow-lg shadow-sky-400/50 ring-2 ring-slate-800', 'bg-sky-600 text-white shadow-lg shadow-black/60 ring-2 ring-white') },
});

// ─── Shared Form Drawer ────────────────────────────────────────────────────────
function PersonDrawer({ dark, mode, initialData, onClose, onSuccess }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const bg = d(dark, 'bg-white', 'bg-slate-900');
  const bg2 = d(dark, 'bg-slate-50', 'bg-slate-800');
  const border = d(dark, 'border-slate-200', 'border-slate-700');
  const border2 = d(dark, 'border-slate-100', 'border-slate-800');
  const text1 = d(dark, 'text-slate-800', 'text-slate-100');
  const text2 = d(dark, 'text-slate-600', 'text-slate-300');
  const text3 = d(dark, 'text-slate-400', 'text-slate-500');
  const inputCls = d(dark, 'bg-slate-50 border-slate-200 text-slate-800', 'bg-slate-800 border-slate-700 text-slate-100');
  const fieldCls = `w-full pr-10 pl-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${inputCls}`;
  const labelCls = `block text-xs font-bold ${text2} mb-1.5 tracking-wide`;

  const setField = (key, val) => { setForm(f => ({ ...f, [key]: val })); setError(''); };

  const focusStyle = e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,.15)'; };
  const blurStyle = e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) return setError('يرجى إدخال الاسم الكامل');
    if (!form.cin.trim()) return setError('يرجى إدخال رقم البطاقة الوطنية');
    if (!form.category) return setError('يرجى اختيار فئة المستفيدة');
    if (!form.year) return setError('يرجى اختيار السنة');
    setLoading(true);
    setError('');
    try {
      const url = isEdit ? '/api/person/update' : '/api/person/add';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { id: initialData._id, ...form } : form;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'حدث خطأ'); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => { onClose(); onSuccess(); }, 1500);
    } catch {
      setError('تعذر الاتصال بالخادم');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center w-full"
      style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
      <div className="flex-1 bg-opacity-50 h-full" />
      <div className={`w-full lg:w-1/2 ${bg} h-full overflow-y-auto shadow-2xl flex flex-col`}
        style={{ animation: 'slideIn .25s cubic-bezier(.4,0,.2,1)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${border} flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${d(dark, isEdit ? 'bg-blue-100' : 'bg-emerald-100', isEdit ? 'bg-blue-900' : 'bg-emerald-900')}`}>
              {isEdit ? <Pencil size={16} className="text-blue-600" /> : <UserPlus size={16} className="text-emerald-600" />}
            </div>
            <div>
              <h2 className={`font-bold text-sm ${text1}`}>{isEdit ? 'تعديل بيانات المستفيدة' : 'إضافة مستفيدة جديدة'}</h2>
              {isEdit && <p className={`text-xs ${text3}`}>{initialData.fullName}</p>}
              {!isEdit && <p className={`text-xs ${text3}`}>أدخل بيانات المستفيدة</p>}
            </div>
          </div>
          <button type="button" onClick={onClose}
            className={`p-2 rounded-xl border cursor-pointer transition-all hover:opacity-70 ${bg2} ${border}`}>
            <X size={15} className={text2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 overflow-y-auto">
          {success ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isEdit ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                <CheckCircle2 size={32} className={isEdit ? 'text-blue-600' : 'text-emerald-600'} />
              </div>
              <h3 className={`text-lg font-bold ${text1} mb-1`}>{isEdit ? 'تم التعديل بنجاح!' : 'تمت الإضافة بنجاح!'}</h3>
              <p className={`text-sm ${text3}`}>جارٍ تحديث اللائحة...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Personal Info */}
              <div className={`${bg2} rounded-2xl border ${border} overflow-hidden`}>
                <div className={`flex items-center gap-2 px-4 py-3 border-b ${border2}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${d(dark, 'bg-emerald-100', 'bg-emerald-900')}`}>
                    <User size={12} className="text-emerald-600" />
                  </div>
                  <span className={`text-xs font-bold ${text1}`}>المعلومات الشخصية</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>الاسم الكامل <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} />
                      <input type="text" placeholder="مثال: فاطمة الزهراء المنصوري"
                        value={form.fullName} onChange={e => setField('fullName', e.target.value)}
                        className={fieldCls} style={{ fontFamily: 'inherit' }}
                        onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>رقم البطاقة <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <CreditCard size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} />
                      <input type="text" placeholder="BK123456"
                        value={form.cin} onChange={e => setField('cin', e.target.value.toUpperCase())}
                        className={`${fieldCls} tracking-widest`} style={{ fontFamily: 'monospace' }}
                        onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>رقم الهاتف</label>
                    <div className="relative">
                      <Phone size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} />
                      <input type="tel" placeholder="0612345678" dir="ltr"
                        value={form.phone} onChange={e => setField('phone', e.target.value)}
                        className={fieldCls} style={{ fontFamily: 'monospace' }}
                        onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>عدد الأطفال</label>
                    <div className="relative">
                      <Baby size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} />
                      <input type="number" min="0" max="20"
                        value={form.childrenCount} onChange={e => setField('childrenCount', e.target.value)}
                        className={fieldCls} style={{ fontFamily: 'inherit' }}
                        onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  </div>
                  {/* ── سنة التسجيل ── */}
                  <div>
                    <label className={labelCls}>سنة التسجيل <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Calendar size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} />
                      <select
                        value={form.year}
                        onChange={e => setField('year', parseInt(e.target.value))}
                        className={`appearance-none ${fieldCls} pl-8`}
                        style={{ fontFamily: 'inherit' }}
                        onFocus={focusStyle} onBlur={blurStyle}>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <ChevronDown size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>ملاحظات</label>
                    <div className="relative">
                      <StickyNote size={14} className={`absolute right-3 top-3 ${text3} pointer-events-none`} />
                      <textarea rows={2} placeholder="أي معلومات إضافية..."
                        value={form.notes} onChange={e => setField('notes', e.target.value)}
                        className={`${fieldCls} resize-none pt-2.5`} style={{ fontFamily: 'inherit' }}
                        onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className={`${bg2} rounded-2xl border ${border} overflow-hidden`}>
                <div className={`flex items-center gap-2 px-4 py-3 border-b ${border2}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${d(dark, 'bg-violet-100', 'bg-violet-900')}`}>
                    <Tag size={12} className="text-violet-600" />
                  </div>
                  <span className={`text-xs font-bold ${text1}`}>الفئة <span className="text-red-500">*</span></span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2.5">
                  {ADD_CATEGORIES.map(cat => {
                    const cfg = ADD_CAT_CFG[cat];
                    const isActive = form.category === cat;
                    const activeCls = d(dark, `${cfg.light} border-2`, `${cfg.dark} border-2`);
                    const inactiveCls = d(dark,
                      'border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100',
                      'border border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                    );
                    return (
                      <button key={cat} type="button" onClick={() => setField('category', cat)}
                        className={`relative flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive ? `${activeCls} scale-[1.02] shadow-md` : inactiveCls}`}
                        style={{ fontFamily: 'inherit' }}>
                        {isActive && (
                          <span className="absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded-full bg-current flex items-center justify-center">
                            <CheckCircle2 size={9} className="text-white" />
                          </span>
                        )}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${d(dark, 'bg-red-50 border-red-200 text-red-700', 'bg-red-900 border-red-800 text-red-300')}`}>
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className={`flex gap-3 p-4 border-t ${border} flex-shrink-0 ${bg}`}>
            <button type="button" onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl cursor-pointer border ${border} ${bg2} text-sm font-semibold ${text2} hover:opacity-80 transition-all`}
              style={{ fontFamily: 'inherit' }}>
              إلغاء
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer border-0 text-white text-sm font-bold shadow-lg active:scale-95 transition-all disabled:opacity-60 ${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              style={{ fontFamily: 'inherit' }}>
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> جارٍ الحفظ...</>
                : isEdit
                  ? <><Pencil size={14} /> حفظ التعديلات</>
                  : <><UserPlus size={14} /> حفظ المستفيدة</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home({ dark }) {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [category, setCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Drawer state — mode: null | 'add' | 'edit'
  const [drawerMode, setDrawerMode] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  // Empty form always uses the currently selected filter year as default
  const emptyForm = () => ({
    fullName: '',
    cin: '',
    phone: '',
    notes: '',
    childrenCount: 0,
    category: '',
    year,
  });

  // Design tokens
  const bg = d(dark, 'bg-white', 'bg-slate-900');
  const bg2 = d(dark, 'bg-slate-50', 'bg-slate-800');
  const bg3 = d(dark, 'bg-slate-100', 'bg-slate-700');
  const pageBg = d(dark, 'bg-slate-100', 'bg-slate-950');
  const border = d(dark, 'border-slate-200', 'border-slate-700');
  const border2 = d(dark, 'border-slate-100', 'border-slate-800');
  const text1 = d(dark, 'text-slate-800', 'text-slate-100');
  const text2 = d(dark, 'text-slate-600', 'text-slate-300');
  const text3 = d(dark, 'text-slate-400', 'text-slate-500');
  const inputCls = d(dark, 'bg-slate-50 border-slate-200 text-slate-800', 'bg-slate-800 border-slate-700 text-slate-100');
  const catConfig = CATEGORY_CONFIG(dark);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ year, category, search });
      const res = await fetch(`/api/person/getAll?${params}`);
      const data = await res.json();
      setPersons(Array.isArray(data) ? data : []);
    } catch { setPersons([]); }
    setLoading(false);
  }, [year, category, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggle = async (id) => {
    setTogglingId(id);
    await fetch('/api/person/toggleChecked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, year }),
    });
    await fetchData();
    setTogglingId(null);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/person/delete?id=${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchData();
  };

  const handleExcel = () => window.open(`/api/person/excel?year=${year}&category=${category}`, '_blank');

  const handleSort = (field) => {
    if (!field) return;
    if (sortField === field) setSortDir(dv => dv === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const openAdd = () => setDrawerMode('add');
  const openEdit = (person) => { setEditTarget(person); setDrawerMode('edit'); };
  const closeDrawer = () => { setDrawerMode(null); setEditTarget(null); };

  const sortedPersons = [...persons].sort((a, b) => {
    let va = a[sortField] ?? '', vb = b[sortField] ?? '';
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const stats = {
    total: persons.length,
    benefited: persons.filter(p => p.checkedThisYear).length,
    notYet: persons.filter(p => !p.checkedThisYear).length,
    rate: persons.length > 0 ? Math.round((persons.filter(p => p.checkedThisYear).length / persons.length) * 100) : 0,
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="opacity-25 mr-1 text-xs">⇅</span>;
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="inline mr-1 text-emerald-500" />
      : <ChevronDown size={11} className="inline mr-1 text-emerald-500" />;
  };

  const columns = [
    { label: '#', field: null, align: 'text-right', w: 'w-10' },
    { label: 'الاسم الكامل', field: 'fullName', align: 'text-right' },
    { label: 'رقم البطاقة', field: 'cin', align: 'text-right' },
    { label: 'رقم الهاتف', field: 'phone', align: 'text-right' },
    { label: 'الأطفال', field: 'childrenCount', align: 'text-right', w: 'w-24' },
    { label: 'ملاحظات', field: null, align: 'text-center' },
    { label: `حالة ${year}`, field: null, align: 'text-center' },
    { label: 'سنوات الاستفادة', field: null, align: 'text-right' },
    { label: 'إجراءات', field: null, align: 'text-center', w: 'w-20' },
  ];

  return (
    <>
      <Head>
        <title>المجلس العلمي — لائحة المستفيدين</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div dir="rtl" className={`min-h-screen ${pageBg} transition-colors duration-300`}
        style={{ fontFamily: "'Cairo','Noto Naskh Arabic',sans-serif" }}>

        {/* ══ HERO ══ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          <div className="max-w-screen-xl mx-auto px-5 py-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 relative">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
                لائحة <span className="text-emerald-400">المستفيدين</span>
                <br />
                <span className="text-lg font-medium text-white opacity-50">من القفة الرمضانية</span>
              </h1>
              <p className="text-sm leading-relaxed max-w-sm mb-8 text-white opacity-55">
                إدارة وتتبع المستفيدين من برنامج مساعدات القفة الرمضانية للأسر المحتاجة
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { val: stats.total, label: 'إجمالي المسجلين', icon: <Users size={11} /> },
                  { val: stats.benefited, label: `استفادت ${year}`, icon: <CheckCircle2 size={11} /> },
                  { val: stats.notYet, label: 'لم تستفد بعد', icon: <Clock size={11} /> },
                  { val: `${stats.rate}%`, label: 'نسبة الاستفادة', icon: <TrendingUp size={11} /> },
                ].map(({ val, label, icon }) => (
                  <div key={label} className="rounded-2xl p-4 text-center"
                    style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                    <div className="text-2xl font-black leading-none mb-1 text-white">{val}</div>
                    <div className="text-xs font-semibold text-white flex items-center justify-center gap-1">{icon}{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-92 rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <img src="/banner.png" alt="برنامج القفة الرمضانية" className="w-full h-full object-cover block" />
            </div>
          </div>
        </section>

        {/* ══ MAIN ══ */}
        <main id="beneficiaries" className="max-w-screen-xl mx-auto px-5 py-6 pb-16">

          {/* Controls */}
          <div className={`${bg} border ${border} rounded-2xl p-4 mb-4 shadow-sm`}>
            <div className="flex flex-wrap gap-3 items-center">

              <div className="relative flex-1 min-w-52">
                <Search className={`absolute right-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} size={14} />
                <input type="text" placeholder="بحث بالاسم أو البطاقة أو الهاتف..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className={`w-full pr-9 ${search ? 'pl-9' : 'pl-3'} py-2.5 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
                  style={{ fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
                {search && (
                  <button type="button" onClick={() => setSearch('')}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer ${text3} flex p-0`}>
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Year selector — filters Person.year (registration year) */}
              <div className="relative flex-shrink-0">
                <Calendar className={`absolute right-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} size={13} />
                <select value={year} onChange={e => setYear(Number(e.target.value))}
                  className={`appearance-none pl-8 pr-9 py-2.5 rounded-xl border text-sm cursor-pointer outline-none transition-all ${inputCls}`}
                  style={{ fontFamily: 'inherit' }}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <ChevronDown className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} size={13} />
              </div>

              <div className="relative flex-shrink-0">
                <Filter className={`absolute right-3 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} size={13} />
                <select value={`${sortField}-${sortDir}`}
                  onChange={e => { const [f, dv] = e.target.value.split('-'); setSortField(f); setSortDir(dv); }}
                  className={`appearance-none pl-8 pr-9 py-2.5 rounded-xl border text-sm cursor-pointer outline-none transition-all ${inputCls}`}
                  style={{ fontFamily: 'inherit' }}>
                  <option value="fullName-asc">الاسم أ–ي</option>
                  <option value="fullName-desc">الاسم ي–أ</option>
                  <option value="childrenCount-desc">الأطفال (أكثر)</option>
                  <option value="childrenCount-asc">الأطفال (أقل)</option>
                </select>
                <ChevronDown className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${text3} pointer-events-none`} size={13} />
              </div>

              <div className="mr-auto flex gap-2">
                <button type="button" onClick={handleExcel}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer border text-sm font-semibold transition-all hover:opacity-80 ${d(dark, 'bg-emerald-50 border-emerald-200 text-emerald-700', 'bg-emerald-900 border-emerald-800 text-emerald-300')}`}
                  style={{ fontFamily: 'inherit' }}>
                  <Download size={13} />
                  تصدير Excel
                </button>
                <button type="button" onClick={openAdd}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer border-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold active:scale-95 transition-all ${d(dark, 'shadow-lg shadow-emerald-400/40', 'shadow-lg shadow-black/60')}`}
                  style={{ fontFamily: 'inherit' }}>
                  <Plus size={14} />
                  إضافة مستفيدة
                </button>
              </div>
            </div>

            <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t ${border2} items-center`}>
              {CATEGORIES.map(cat => {
                const cfg = catConfig[cat];
                const isActive = category === cat;
                return (
                  <button type="button" key={cat} onClick={() => setCategory(cat)}
                    className={`px-4 py-1.5 rounded-full border-0 text-xs font-bold cursor-pointer transition-all duration-200 ${isActive ? cfg.active : cfg.pill}`}
                    style={{ fontFamily: 'inherit' }}>
                    {cat}
                  </button>
                );
              })}
              {persons.length > 0 && (
                <span className={`mr-auto text-xs ${text3} font-medium flex items-center gap-1`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {sortedPersons.length} نتيجة
                </span>
              )}
            </div>
          </div>

          {/* Table / Cards */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-9 h-9 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
              <p className={`${text3} text-sm`}>جارٍ التحميل...</p>
            </div>
          ) : sortedPersons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className={`w-16 h-16 rounded-2xl ${bg3} flex items-center justify-center mb-4`}>
                <Users size={28} className={text3} />
              </div>
              <p className={`${text2} font-semibold mb-1`}>لا توجد نتائج</p>
              <p className={`${text3} text-sm`}>جرب تغيير الفلتر أو البحث</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className={`hidden lg:block ${bg} border ${border} rounded-2xl overflow-hidden shadow-sm`}>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className={`${bg2} border-b ${border}`}>
                      {columns.map(({ label, field, align, w }) => (
                        <th key={label} onClick={() => handleSort(field)}
                          className={`px-4 py-3 ${align} ${w || ''} text-xs font-bold ${text3} uppercase tracking-wider select-none ${field ? 'cursor-pointer hover:text-emerald-500' : 'cursor-default'} transition-colors`}>
                          {label} {field && <SortIcon field={field} />}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPersons.map((person, idx) => (
                      <tr key={person._id} className={`border-b ${border2} transition-colors`}
                        onMouseEnter={e => e.currentTarget.style.background = d(dark, '#f8fafc', '#1e293b')}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-xs font-mono ${text3}`}>{idx + 1}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-row-reverse items-center gap-2.5 justify-end">
                            <div>
                              <div className={`font-bold ${text1} text-sm`}>{person.fullName}</div>
                              {person.category && <div className={`text-xs ${text3} mt-0.5`}>{person.category}</div>}
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {person.fullName?.charAt(0)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold font-mono text-xs border px-2.5 py-1 rounded-lg ${d(dark, 'bg-slate-100 border-slate-200 text-slate-600', 'bg-slate-800 border-slate-700 text-slate-300')}`}>
                            {person.cin}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold text-xs ${text2} flex items-center gap-1.5`}>
                            {person.phone ? <><Phone size={10} className="text-sky-400" />{person.phone}</> : <span className={text3}>—</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${d(dark, 'bg-violet-100 text-violet-700', 'bg-violet-900 text-white')}`}>
                            <Baby size={14} />{person.childrenCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center max-w-28 overflow-hidden" title={person.notes}>
                          {person.notes
                            ? <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md ${d(dark, 'bg-amber-50 text-amber-600', 'bg-amber-900 text-amber-300')}`}>
                              <StickyNote size={9} /><span className="overflow-hidden">{person.notes}</span>
                            </span>
                            : <span className={text3}>—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <label className="inline-flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" checked={!!person.checkedThisYear} onChange={() => handleToggle(person._id)} disabled={togglingId === person._id} className="hidden" />
                            <div className={`relative w-11 h-6 rounded-full transition-all duration-300 ${person.checkedThisYear ? 'bg-emerald-500' : d(dark, 'bg-slate-300', 'bg-slate-600')} ${togglingId === person._id ? 'opacity-50' : ''}`}>
                              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${person.checkedThisYear ? 'left-5' : 'left-0.5'}`} />
                            </div>
                            <span className={`text-xs font-bold whitespace-nowrap ${person.checkedThisYear ? 'text-emerald-600' : text3}`}>
                              {person.checkedThisYear ? '✓ استفادت' : 'لم تستفد'}
                            </span>
                          </label>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="grid grid-cols-3">
                            {person.benefitYears?.length > 0
                              ? person.benefitYears.map(y => (
                                <span key={y} className={`text-xs w-fit mb-2 font-mono border px-1.5 py-0.5 rounded ${d(dark, 'bg-emerald-50 text-emerald-700 border-emerald-100', 'bg-emerald-900 text-emerald-400 border-emerald-800')}`}>{y}</span>
                              ))
                              : <span className={text3}>—</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-1.5">
                            <button type="button" onClick={() => openEdit(person)}
                              className={`p-1.5 rounded-lg cursor-pointer flex items-center justify-center border transition-colors ${d(dark, 'border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100', 'border-blue-800 bg-blue-900 text-blue-400 hover:bg-blue-800')}`}
                              title="تعديل"><Pencil size={12} /></button>
                            <button type="button" onClick={() => setDeleteConfirm(person)}
                              className={`p-1.5 rounded-lg cursor-pointer flex items-center justify-center border transition-colors ${d(dark, 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100', 'border-red-800 bg-red-900 text-red-400 hover:bg-red-800')}`}
                              title="حذف"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={`flex items-center justify-between px-4 py-2.5 border-t ${border} ${bg2}`}>
                  <span className={`text-xs ${text3}`}>عرض {sortedPersons.length} سجل — سنة {year}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><span className="text-emerald-600 font-semibold">{stats.benefited} استفادت</span></span>
                    <span className="text-xs flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /><span className="text-amber-600 font-semibold">{stats.notYet} لم تستفد بعد</span></span>
                  </div>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="flex flex-col gap-3 lg:hidden">
                {sortedPersons.map((person, idx) => (
                  <div key={person._id} className={`${bg} border ${border} rounded-2xl p-4 shadow-sm`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {person.fullName?.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${text1}`}>{person.fullName}</p>
                          <span className={`text-xs ${text3}`}>#{idx + 1} · {person.year}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => openEdit(person)}
                          className={`p-1.5 rounded-lg cursor-pointer flex items-center border transition-colors ${d(dark, 'border-blue-200 bg-blue-50 text-blue-500', 'border-blue-800 bg-blue-900 text-blue-400')}`}><Pencil size={12} /></button>
                        <button type="button" onClick={() => setDeleteConfirm(person)}
                          className={`p-1.5 rounded-lg cursor-pointer flex items-center border transition-colors ${d(dark, 'border-red-200 bg-red-50 text-red-500', 'border-red-800 bg-red-900 text-red-400')}`}><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className={`flex items-center gap-1.5 ${bg2} rounded-lg px-2.5 py-1.5 ${text2}`}>
                        <CreditCard size={10} className={`${text3} flex-shrink-0`} /><span className="font-mono">{person.cin}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${bg2} rounded-lg px-2.5 py-1.5 ${text2}`}>
                        <Phone size={10} className="text-sky-400 flex-shrink-0" /><span>{person.phone || '—'}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ${d(dark, 'bg-violet-100 text-violet-700', 'bg-violet-900 text-violet-300')}`}>
                        <Baby size={10} className="flex-shrink-0" /><span className="font-semibold">{person.childrenCount} أطفال</span>
                      </div>
                      {person.notes && (
                        <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 col-span-2 overflow-hidden ${d(dark, 'bg-amber-50 text-amber-700', 'bg-amber-900 text-amber-300')}`}>
                          <StickyNote size={10} className="flex-shrink-0" /><span className="text-ellipsis overflow-hidden whitespace-nowrap">{person.notes}</span>
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center justify-between pt-3 border-t ${border2}`}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!person.checkedThisYear} onChange={() => handleToggle(person._id)} className="hidden" />
                        <div className={`relative w-11 h-6 rounded-full transition-all duration-300 ${person.checkedThisYear ? 'bg-emerald-500' : d(dark, 'bg-slate-300', 'bg-slate-600')}`}>
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${person.checkedThisYear ? 'left-5' : 'left-0.5'}`} />
                        </div>
                        <span className={`text-xs font-bold ${person.checkedThisYear ? 'text-emerald-600' : text3}`}>
                          {person.checkedThisYear ? '✓ استفادت' : 'لم تستفد'}
                        </span>
                      </label>
                      {person.benefitYears?.length > 0 && (
                        <div className="flex gap-1 flex-wrap justify-end">
                          {person.benefitYears.slice(-3).map(y => (
                            <span key={y} className={`text-xs font-mono border px-1.5 py-0.5 rounded ${d(dark, 'bg-emerald-50 text-emerald-700 border-emerald-100', 'bg-emerald-900 text-emerald-400 border-emerald-800')}`}>{y}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <p className={`text-center text-xs ${text3} py-2`}>عرض {sortedPersons.length} سجل — سنة {year}</p>
              </div>
            </>
          )}
        </main>

        {/* ══ ADD / EDIT DRAWER ══ */}
        {drawerMode === 'add' && (
          <PersonDrawer
            dark={dark}
            mode="add"
            initialData={emptyForm()}
            onClose={closeDrawer}
            onSuccess={fetchData}
          />
        )}
        {drawerMode === 'edit' && editTarget && (
          <PersonDrawer
            dark={dark}
            mode="edit"
            initialData={{
              _id: editTarget._id,
              fullName: editTarget.fullName || '',
              cin: editTarget.cin || '',
              phone: editTarget.phone || '',
              notes: editTarget.notes || '',
              childrenCount: editTarget.childrenCount ?? 0,
              category: editTarget.category || '',
              year: editTarget.year || CURRENT_YEAR,
            }}
            onClose={closeDrawer}
            onSuccess={fetchData}
          />
        )}

        {/* ══ DELETE MODAL ══ */}
        {deleteConfirm && (
          <div onClick={() => setDeleteConfirm(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60"
            style={{ backdropFilter: 'blur(8px)' }}>
            <div onClick={e => e.stopPropagation()}
              className={`${bg} border ${border} rounded-2xl p-6 max-w-sm w-full shadow-2xl`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 ${d(dark, 'bg-red-50 border-red-100', 'bg-red-900 border-red-800')}`}>
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${text1}`}>تأكيد الحذف</h3>
                  <p className={`text-xs ${text3}`}>هذا الإجراء لا يمكن التراجع عنه</p>
                </div>
              </div>
              <div className={`border rounded-xl px-4 py-3 mb-5 text-sm ${text2} ${d(dark, 'bg-red-50 border-red-100', 'bg-red-900 border-red-800')}`}>
                هل أنت متأكد من حذف <strong className={`${text1} font-bold`}>{deleteConfirm.fullName}</strong>؟
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setDeleteConfirm(null)}
                  className={`flex-1 py-2.5 rounded-xl cursor-pointer border ${border} ${bg2} text-sm font-semibold ${text2} hover:opacity-80 transition-all`}
                  style={{ fontFamily: 'inherit' }}>إلغاء</button>
                <button type="button" onClick={() => handleDelete(deleteConfirm._id)}
                  className="flex-1 py-2.5 rounded-xl cursor-pointer border-0 bg-red-500 hover:bg-red-600 text-sm font-bold text-white shadow-lg active:scale-95 transition-all"
                  style={{ fontFamily: 'inherit' }}>حذف</button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
          * { font-family: 'Cairo','Noto Naskh Arabic',sans-serif !important; }
          .font-mono, .font-mono * { font-family:'Courier New',monospace !important; }
          select option { background: ${dark ? '#1e293b' : '#fff'}; color: ${dark ? '#e2e8f0' : '#0f172a'}; }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
}