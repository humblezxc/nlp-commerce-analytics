import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import sequelize from '../config/database.js';
import { generateSqlFromNaturalLanguage, getTemplateQuery } from '../services/openai.js';

const router = Router();

router.use(authMiddleware);

router.post('/generate', async (req, res) => {
  try {
    const { type, templateId, query, dateFrom, dateTo } = req.body;
    const storeId = req.user.storeId;

    let sql;
    let reportType;

    if (type === 'template') {
      if (!templateId) {
        return res.status(400).json({ error: 'Template ID is required' });
      }

      sql = getTemplateQuery(templateId, storeId, dateFrom, dateTo);

      if (!sql) {
        return res.status(400).json({ error: 'Invalid template ID' });
      }

      reportType = templateId;
    } else if (type === 'nlp') {
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ error: 'Query is required' });
      }

      if (query.length > 500) {
        return res.status(400).json({ error: 'Query too long (max 500 characters)' });
      }

      try {
        sql = await generateSqlFromNaturalLanguage(query, storeId);
        reportType = 'custom';
      } catch (err) {
        if (err.message.includes('API key')) {
          return res.status(503).json({
            error: 'AI service not configured. Please use templates instead.',
            code: 'AI_NOT_CONFIGURED'
          });
        }
        return res.status(400).json({ error: err.message });
      }
    } else {
      return res.status(400).json({ error: 'Invalid report type' });
    }

    const [results] = await sequelize.query(sql);

    const chartType = determineChartType(reportType, results);

    res.json({
      success: true,
      data: results,
      metadata: {
        type: reportType,
        chartType,
        rowCount: results.length,
        generatedAt: new Date().toISOString(),
        dateRange: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : null
      }
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

function determineChartType(reportType, data) {
  if (!data || data.length === 0) return 'table';

  const columns = Object.keys(data[0]);

  if (reportType === 'sales_summary') return 'stats';
  if (reportType === 'revenue_by_period') return 'line';
  if (reportType === 'top_products') return 'bar';
  if (reportType === 'orders_list') return 'table';

  if (columns.includes('date') && columns.includes('revenue')) return 'line';
  if (columns.some(c => c.includes('count') || c.includes('total'))) return 'bar';

  return 'table';
}

router.get('/templates', (req, res) => {
  res.json({
    templates: [
      {
        id: 'sales_summary',
        name: 'Sales Summary',
        description: 'Overview of total sales, revenue, and order counts',
        chartType: 'stats'
      },
      {
        id: 'top_products',
        name: 'Top Products',
        description: 'Best selling products by quantity and revenue',
        chartType: 'bar'
      },
      {
        id: 'orders_list',
        name: 'Orders List',
        description: 'Detailed list of all orders with customer info',
        chartType: 'table'
      },
      {
        id: 'revenue_by_period',
        name: 'Revenue by Period',
        description: 'Revenue breakdown by day',
        chartType: 'line'
      }
    ]
  });
});

export default router;
