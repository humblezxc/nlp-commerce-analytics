import Store from './Store.js';
import User from './User.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

Store.hasMany(User, { foreignKey: 'storeId' });
User.belongsTo(Store, { foreignKey: 'storeId' });

Store.hasMany(Order, { foreignKey: 'storeId' });
Order.belongsTo(Store, { foreignKey: 'storeId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

export { Store, User, Order, OrderItem };
