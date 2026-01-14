import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are a SQL query generator for an e-commerce analytics system.
You must generate valid SQLite queries based on user requests.

DATABASE SCHEMA:
- stores (id INTEGER PRIMARY KEY, name TEXT)
- users (id INTEGER PRIMARY KEY, username TEXT, password_hash TEXT, store_id INTEGER REFERENCES stores(id))
- orders (id INTEGER PRIMARY KEY, store_id INTEGER REFERENCES stores(id), customer_name TEXT, order_date DATETIME, total_amount DECIMAL(10,2))
- order_items (id INTEGER PRIMARY KEY, order_id INTEGER REFERENCES orders(id), product_id INTEGER, quantity INTEGER, price_at_purchase DECIMAL(10,2), item_name TEXT)

IMPORTANT RULES:
1. ALWAYS include "WHERE store_id = :storeId" in queries involving orders or order_items to enforce row-level security
2. For order_items, join with orders table to filter by store_id
3. Use SQLite date functions: date(), datetime(), strftime()
4. For "last N days", use: date(order_date) >= date('now', '-N days')
5. Return ONLY the SQL query, no explanations
6. Use column aliases for clarity (e.g., AS total_revenue)
7. Always order results meaningfully (by date DESC, by amount DESC, etc.)

EXAMPLES:
User: "Show me total sales for the last 7 days"
SQL: SELECT date(order_date) as date, COUNT(*) as order_count, SUM(total_amount) as revenue FROM orders WHERE store_id = :storeId AND date(order_date) >= date('now', '-7 days') GROUP BY date(order_date) ORDER BY date DESC

User: "What are my top 5 selling products?"
SQL: SELECT oi.item_name, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.price_at_purchase) as revenue FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.store_id = :storeId GROUP BY oi.item_name ORDER BY total_sold DESC LIMIT 5

User: "List all orders over $100"
SQL: SELECT id, customer_name, order_date, total_amount FROM orders WHERE store_id = :storeId AND total_amount > 100 ORDER BY order_date DESC`;

export async function generateSqlFromNaturalLanguage(query, storeId) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: query }
    ],
    temperature: 0,
    max_tokens: 500
  });

  let sql = completion.choices[0].message.content.trim();

  sql = sql.replace(/```sql\n?/gi, '').replace(/```\n?/g, '').trim();

  if (!sql.toLowerCase().includes(':storeid')) {
    throw new Error('Generated query does not include store_id filter');
  }

  sql = sql.replace(/:storeId/g, storeId);

  const forbidden = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE'];
  const upperSql = sql.toUpperCase();
  for (const word of forbidden) {
    if (upperSql.includes(word)) {
      throw new Error('Query contains forbidden operations');
    }
  }

  return sql;
}

export function getTemplateQuery(templateId, storeId, dateFrom, dateTo) {
  const dateFilter = dateFrom && dateTo
    ? `AND date(order_date) BETWEEN '${dateFrom}' AND '${dateTo}'`
    : '';

  const templates = {
    sales_summary: `
      SELECT
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        MIN(total_amount) as min_order,
        MAX(total_amount) as max_order
      FROM orders
      WHERE store_id = ${storeId} ${dateFilter}
    `,

    top_products: `
      SELECT
        oi.item_name as name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price_at_purchase) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.store_id = ${storeId} ${dateFilter.replace('order_date', 'o.order_date')}
      GROUP BY oi.item_name
      ORDER BY total_sold DESC
      LIMIT 10
    `,

    orders_list: `
      SELECT
        o.id,
        o.customer_name,
        o.order_date,
        o.total_amount,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.store_id = ${storeId} ${dateFilter.replace('order_date', 'o.order_date')}
      GROUP BY o.id
      ORDER BY o.order_date DESC
      LIMIT 50
    `,

    revenue_by_period: `
      SELECT
        date(order_date) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE store_id = ${storeId} ${dateFilter}
      GROUP BY date(order_date)
      ORDER BY date DESC
      LIMIT 30
    `
  };

  return templates[templateId] || null;
}
