import connectDB from '../_lib/connect';
import Basket from '../_models/Basket';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { year, items, amount } = req.body;
  if (!year) return res.status(400).json({ error: 'السنة مطلوبة' });
  await connectDB();
  const basket = await Basket.findOneAndUpdate(
    { year: Number(year) },
    { items: items || [], amount: amount ?? null },
    { upsert: true, new: true, runValidators: true }
  );
  return res.status(200).json(basket);
}