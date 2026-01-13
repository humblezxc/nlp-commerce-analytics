import bcrypt from 'bcrypt';
import { Store, User, Order, OrderItem } from '../models/index.js';

const seedDatabase = async () => {
  const storeCount = await Store.count();
  if (storeCount > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');

  const storeA = await Store.create({ name: 'Store A' });
  const storeB = await Store.create({ name: 'Store B' });

  const passwordHash = await bcrypt.hash('password123', 10);

  await User.create({
    username: 'owner_a',
    passwordHash,
    storeId: storeA.id
  });

  await User.create({
    username: 'owner_b',
    passwordHash,
    storeId: storeB.id
  });

  const storeAOrders = [
    { customerName: 'John Smith', totalAmount: 150.00, daysAgo: 1 },
    { customerName: 'Jane Doe', totalAmount: 89.99, daysAgo: 2 },
    { customerName: 'Bob Wilson', totalAmount: 234.50, daysAgo: 3 },
    { customerName: 'Alice Brown', totalAmount: 67.25, daysAgo: 5 },
    { customerName: 'Charlie Davis', totalAmount: 445.00, daysAgo: 7 },
    { customerName: 'Diana Miller', totalAmount: 123.75, daysAgo: 10 },
    { customerName: 'Edward Jones', totalAmount: 78.50, daysAgo: 14 },
    { customerName: 'Fiona Garcia', totalAmount: 299.99, daysAgo: 20 },
    { customerName: 'George Martinez', totalAmount: 156.00, daysAgo: 25 },
    { customerName: 'Hannah Lee', totalAmount: 89.00, daysAgo: 30 }
  ];

  const storeBOrders = [
    { customerName: 'Ivan Rodriguez', totalAmount: 199.99, daysAgo: 1 },
    { customerName: 'Julia White', totalAmount: 345.00, daysAgo: 2 },
    { customerName: 'Kevin Harris', totalAmount: 56.75, daysAgo: 4 },
    { customerName: 'Laura Clark', totalAmount: 189.50, daysAgo: 6 },
    { customerName: 'Michael Lewis', totalAmount: 423.25, daysAgo: 8 },
    { customerName: 'Nancy Walker', totalAmount: 67.00, daysAgo: 12 },
    { customerName: 'Oscar Hall', totalAmount: 234.99, daysAgo: 15 },
    { customerName: 'Patricia Young', totalAmount: 145.50, daysAgo: 18 },
    { customerName: 'Quinn King', totalAmount: 89.25, daysAgo: 22 },
    { customerName: 'Rachel Scott', totalAmount: 312.00, daysAgo: 28 }
  ];

  const products = [
    { id: 1, name: 'Wireless Headphones', price: 79.99 },
    { id: 2, name: 'USB-C Cable', price: 12.99 },
    { id: 3, name: 'Phone Case', price: 24.99 },
    { id: 4, name: 'Laptop Stand', price: 45.00 },
    { id: 5, name: 'Bluetooth Speaker', price: 59.99 },
    { id: 6, name: 'Webcam HD', price: 89.99 },
    { id: 7, name: 'Keyboard Mechanical', price: 129.99 },
    { id: 8, name: 'Mouse Wireless', price: 34.99 },
    { id: 9, name: 'Monitor Arm', price: 67.50 },
    { id: 10, name: 'Desk Lamp LED', price: 42.00 }
  ];

  for (const orderData of storeAOrders) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - orderData.daysAgo);

    const order = await Order.create({
      storeId: storeA.id,
      customerName: orderData.customerName,
      orderDate,
      totalAmount: orderData.totalAmount
    });

    const numItems = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numItems; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity,
        priceAtPurchase: product.price,
        itemName: product.name
      });
    }
  }

  for (const orderData of storeBOrders) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - orderData.daysAgo);

    const order = await Order.create({
      storeId: storeB.id,
      customerName: orderData.customerName,
      orderDate,
      totalAmount: orderData.totalAmount
    });

    const numItems = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numItems; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity,
        priceAtPurchase: product.price,
        itemName: product.name
      });
    }
  }

  console.log('Database seeded successfully');
};

export default seedDatabase;
