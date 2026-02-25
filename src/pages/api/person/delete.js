import connectDB from '../_lib/connect';
import Person from '../_models/Person';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();
  await connectDB();
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID required' });
  await Person.findByIdAndDelete(id);
  res.status(200).json({ success: true });
}
