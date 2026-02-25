import connectDB from '../_lib/connect';
import Person from '../_models/Person';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await connectDB();
  const { year, category, search } = req.query;

  let query = {};
  if (category && category !== 'الكل') query.category = category;
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { cin: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const persons = await Person.find(query).sort({ createdAt: -1 }).lean();

  // Add computed fields per year
  const selectedYear = year ? parseInt(year) : new Date().getFullYear();
  const result = persons.map((p, i) => ({
    ...p,
    index: i + 1,
    checkedThisYear: p.checkedYears.includes(selectedYear),
    benefitYears: p.checkedYears.sort(),
  }));

  console.log(result)
  res.status(200).json(result);
}