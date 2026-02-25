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
    // The year this beneficiary record was created / registered
    year: { type: Number, required: true },
    // All years this person (identified by CIN) has been checked/received aid
    checkedYears: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Person || mongoose.model('Person', PersonSchema);