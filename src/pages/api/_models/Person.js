import mongoose from 'mongoose';

const PersonSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    cin: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    notes: { type: String, trim: true },
    childrenCount: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ['الأسر المعوزة', 'المتخلى عنها زوجها', 'المطلقات', 'الأرامل'],
      required: true,
    },
    // checkedYears: array of years in which this person had status "استفادت"
    checkedYears: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Person || mongoose.model('Person', PersonSchema);
