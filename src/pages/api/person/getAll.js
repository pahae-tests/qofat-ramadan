import connectDB from '../_lib/connect';
import Person from '../_models/Person';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await connectDB();

  const { year, category, search } = req.query;
  const selectedYear = year ? parseInt(year) : new Date().getFullYear();

  // Always filter by the registration year
  let query = { year: selectedYear };

  if (category && category !== 'الكل') query.category = category;

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { cin: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const persons = await Person.find(query).sort({ createdAt: -1 }).lean();

  // For each person, gather ALL checkedYears across ALL records sharing the same CIN
  // (a person may have been registered in multiple years)
  const allCins = [...new Set(persons.map(p => p.cin))];
  const allRecordsForCins = await Person.find({ cin: { $in: allCins } }, { cin: 1, checkedYears: 1 }).lean();

  // Build a map: cin -> merged checkedYears
  const cinCheckedMap = {};
  for (const record of allRecordsForCins) {
    if (!cinCheckedMap[record.cin]) cinCheckedMap[record.cin] = new Set();
    for (const y of record.checkedYears) cinCheckedMap[record.cin].add(y);
  }

  const result = persons.map((p, i) => ({
    ...p,
    index: i + 1,
    checkedThisYear: p.checkedYears.includes(selectedYear),
    // benefitYears = all years this person (by CIN) was ever checked
    benefitYears: [...(cinCheckedMap[p.cin] || [])].sort((a, b) => a - b),
  }));

  res.status(200).json(result);
}