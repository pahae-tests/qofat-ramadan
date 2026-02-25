import connectDB from '../_lib/connect';
import Person from '../_models/Person';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await connectDB();

  const { id, year } = req.body;
  if (!id || !year) return res.status(400).json({ error: 'ID and year required' });

  const person = await Person.findById(id);
  if (!person) return res.status(404).json({ error: 'Not found' });

  const yr = parseInt(year);
  if (person.checkedYears.includes(yr)) {
    person.checkedYears = person.checkedYears.filter((y) => y !== yr);
  } else {
    person.checkedYears.push(yr);
  }
  await person.save();
  res.status(200).json({ checkedYears: person.checkedYears });
}