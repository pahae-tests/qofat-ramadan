import connectDB from '../_lib/connect';
import Person from '../_models/Person';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await connectDB();

  const { fullName, cin, phone, notes, childrenCount, category } = req.body;

  if (!fullName || !cin || !category) {
    return res.status(400).json({ error: 'الاسم الكامل، رقم البطاقة، والفئة إلزامية' });
  }

  const existing = await Person.findOne({ cin: cin.trim() });
  if (existing) {
    return res.status(409).json({ error: 'رقم البطاقة الوطنية مسجل مسبقاً' });
  }

  const person = await Person.create({
    fullName: fullName.trim(),
    cin: cin.trim(),
    phone: phone?.trim() || '',
    notes: notes?.trim() || '',
    childrenCount: Number(childrenCount) || 0,
    category,
    checkedYears: [],
  });

  res.status(201).json(person);
}
