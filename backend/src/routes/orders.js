import { Router } from 'express';
import { Order, OrderItem } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { storeId: req.user.storeId },
      include: [{ model: OrderItem }],
      order: [['orderDate', 'DESC']]
    });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { storeId: req.user.storeId },
      include: [{ model: OrderItem }]
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemCounts = {};
    orders.forEach(order => {
      order.OrderItems.forEach(item => {
        if (!itemCounts[item.itemName]) {
          itemCounts[item.itemName] = { quantity: 0, revenue: 0 };
        }
        itemCounts[item.itemName].quantity += item.quantity;
        itemCounts[item.itemName].revenue += parseFloat(item.priceAtPurchase) * item.quantity;
      });
    });

    const topProducts = Object.entries(itemCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      stats: {
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        averageOrderValue: averageOrderValue.toFixed(2),
        topProducts
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        storeId: req.user.storeId
      },
      include: [{ model: OrderItem }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
