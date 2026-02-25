import connectDB from '../_lib/connect';
import Person from '../_models/Person';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { id, year, fullName, cin, phone, notes, childrenCount, category } = req.body;

  if (!id)       return res.status(400).json({ error: 'معرف الشخص مطلوب' });
  if (!fullName) return res.status(400).json({ error: 'الاسم الكامل مطلوب' });
  if (!cin)      return res.status(400).json({ error: 'رقم البطاقة مطلوب' });
  if (!category) return res.status(400).json({ error: 'الفئة مطلوبة' });

  const selectedYear = year ? parseInt(year) : new Date().getFullYear();

  try {
    await connectDB();

    // Check CIN uniqueness within the same year, excluding current record
    const existing = await Person.findOne({
      cin: cin.trim().toUpperCase(),
      year: selectedYear,
      _id: { $ne: id },
    });
    if (existing) {
      return res.status(400).json({ error: 'رقم البطاقة مستخدم من طرف شخص آخر في نفس السنة' });
    }

    // Fetch current record to detect year change
    const current = await Person.findById(id);
    if (!current) return res.status(404).json({ error: 'الشخص غير موجود' });

    // If the year changed, remove the old year from checkedYears
    let checkedYears = [...current.checkedYears];
    if (current.year !== selectedYear) {
      checkedYears = checkedYears.filter(y => y !== current.year);
    }

    const updated = await Person.findByIdAndUpdate(
      id,
      {
        fullName: fullName.trim(),
        cin: cin.trim().toUpperCase(),
        phone: phone?.trim() || '',
        notes: notes?.trim() || '',
        childrenCount: Number(childrenCount) || 0,
        category,
        year: selectedYear,
        checkedYears,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'الشخص غير موجود' });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'خطأ في الخادم', details: err.message });
  }
}