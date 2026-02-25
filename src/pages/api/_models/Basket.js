import mongoose from 'mongoose';

const BasketSchema = new mongoose.Schema(
  {
    year:       { type: Number, required: true, unique: true },
    items:      { type: [String], default: [] },
    amount:     { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Basket || mongoose.model('Basket', BasketSchema);