import connectDB from '../_lib/connect';
import Person from '../_models/Person';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await connectDB();

  const { year, fullName, cin, phone, notes, childrenCount, category } = req.body;

  if (!fullName || !cin || !category) {
    return res.status(400).json({ error: 'الاسم الكامل، رقم البطاقة، والفئة إلزامية' });
  }

  const selectedYear = year ? parseInt(year) : new Date().getFullYear();

  // CIN must be unique per year (same person can appear in different years)
  const existing = await Person.findOne({ cin: cin.trim().toUpperCase(), year: selectedYear });
  if (existing) {
    return res.status(409).json({ error: `رقم البطاقة الوطنية مسجل مسبقاً في سنة ${selectedYear}` });
  }

  // Fetch checkedYears history from all previous records with the same CIN
  const allRecords = await Person.find({ cin: cin.trim().toUpperCase() }).lean();
  const historicalCheckedYears = [...new Set(allRecords.flatMap(r => r.checkedYears))];

  const person = await Person.create({
    fullName: fullName.trim(),
    cin: cin.trim().toUpperCase(),
    phone: phone?.trim() || '',
    notes: notes?.trim() || '',
    childrenCount: Number(childrenCount) || 0,
    category,
    year: selectedYear,
    checkedYears: historicalCheckedYears,
  });

  res.status(201).json(person);
}