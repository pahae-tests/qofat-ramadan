import connectDB from '../_lib/connect';
import Basket from '../_models/Basket';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { year } = req.query;
  if (!year) return res.status(400).json({ error: 'السنة مطلوبة' });
  await connectDB();
  const basket = await Basket.findOne({ year: Number(year) });
  return res.status(200).json(basket || null);
}