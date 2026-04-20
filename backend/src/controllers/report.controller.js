const Expense = require('../models/Expense.model');

/**
 * @desc    Export expenses as CSV
 * @route   GET /api/reports/csv?month=4&year=2026
 * @access  Private
 */
const exportCSV = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate('category', 'name')
      .sort('-date')
      .lean();

    // Build CSV content
    const headers = 'Date,Title,Category,Type,Amount,Payment Method,Description\n';
    const rows = expenses
      .map((e) =>
        [
          new Date(e.date).toLocaleDateString('en-IN'),
          `"${e.title}"`,
          e.category?.name || 'N/A',
          e.type,
          e.amount.toFixed(2),
          e.paymentMethod,
          `"${e.description || ''}"`,
        ].join(',')
      )
      .join('\n');

    const csv = headers + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ExpenseIQ_${year}_${month}.csv`
    );
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export expenses as PDF
 * @route   GET /api/reports/pdf?month=4&year=2026
 * @access  Private
 */
const exportPDF = async (req, res, next) => {
  try {
    const PDFDocument = require('pdfkit');

    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate('category', 'name')
      .sort('-date')
      .lean();

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ExpenseIQ_${year}_${month}.pdf`
    );

    doc.pipe(res);

    // Title
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('ExpenseIQ — Monthly Report', { align: 'center' });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(
        `Period: ${new Date(year, month - 1).toLocaleString('en-IN', {
          month: 'long',
          year: 'numeric',
        })}`,
        { align: 'center' }
      );
    doc.moveDown(1);

    // Summary
    const totalExpense = expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = expenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    doc.fontSize(11).font('Helvetica-Bold');
    doc.text(`Total Income:  ₹${totalIncome.toFixed(2)}`);
    doc.text(`Total Expense: ₹${totalExpense.toFixed(2)}`);
    doc.text(`Net Savings:   ₹${(totalIncome - totalExpense).toFixed(2)}`);
    doc.moveDown(1);

    // Table header
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Date', 50, doc.y, { continued: false });

    // Expense rows
    doc.font('Helvetica').fontSize(9);
    expenses.forEach((e) => {
      if (doc.y > 700) doc.addPage();
      const line = `${new Date(e.date).toLocaleDateString('en-IN')}  |  ${e.title}  |  ${e.category?.name || 'N/A'}  |  ${e.type}  |  ₹${e.amount.toFixed(2)}`;
      doc.text(line, 50);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

module.exports = { exportCSV, exportPDF };
