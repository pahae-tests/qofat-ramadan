import connectDB from '../_lib/connect';
import Person from '../_models/Person';
import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await connectDB();

  const { year, category } = req.query;
  const selectedYear = year ? parseInt(year) : new Date().getFullYear();

  let query = {};
  if (category && category !== 'الكل') query.category = category;

  const persons = await Person.find(query).sort({ createdAt: -1 }).lean();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('المستفيدون', { views: [{ rightToLeft: true }] });

  sheet.columns = [
    { header: 'الرقم', key: 'index', width: 8 },
    { header: 'الاسم الكامل', key: 'fullName', width: 25 },
    { header: 'رقم البطاقة', key: 'cin', width: 15 },
    { header: 'رقم الهاتف', key: 'phone', width: 15 },
    { header: 'عدد الأطفال', key: 'childrenCount', width: 12 },
    { header: 'الفئة', key: 'category', width: 20 },
    { header: 'الحالة', key: 'status', width: 15 },
    { header: 'سنوات الاستفادة', key: 'benefitYears', width: 25 },
    { header: 'ملاحظات', key: 'notes', width: 30 },
  ];

  // Style header row
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  persons.forEach((p, i) => {
    const checked = p.checkedYears.includes(selectedYear);
    sheet.addRow({
      index: i + 1,
      fullName: p.fullName,
      cin: p.cin,
      phone: p.phone || '',
      childrenCount: p.childrenCount,
      category: p.category,
      status: checked ? 'استفادت' : 'لم تستفد بعد',
      benefitYears: p.checkedYears.sort().join('، '),
      notes: p.notes || '',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=mustafidoun-${selectedYear}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
}
