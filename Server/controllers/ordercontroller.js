const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    const orders = req.body; // استقبل قائمة من الطلبات

    try {
        // تحقق من أن البيانات المستلمة هي مصفوفة
        if (!Array.isArray(orders)) {
            return res.status(400).json({ message: 'Invalid input: expected an array of orders' });
        }

        // استخدم Promise.all لمعالجة الطلبات في وقت واحد
        const createdOrders = await Promise.all(
            orders.map(async (order) => {
                const { name, price, count, total } = order;
                // تحقق من أن الحقول المطلوبة موجودة
                if (!name || !price || !count || !total) {
                    throw new Error('Order validation failed: name, price, count, and total are required.');
                }
        
                // إنشاء كائن الطلب الجديد
                return await Order.create({ name, price, count, total });
            })
        );
        
        // خزن كل الأسماء في مصفوفة
        const allNames = createdOrders.map(order => order.name);
        
        console.log('All Names:', allNames);
        
        res.status(201).json({ 
            message: 'Orders created successfully', 
            data: createdOrders,
            allNames: allNames // أضف الأسماء هنا
        });
    } catch (error) {
        console.error('Error creating orders:', error);
        res.status(400).json({ message: error.message });
    }
};





exports.getOrder = async (req, res) => {
    try {
        const order = await Order.find();
        console.log(order);  // يظهر البيانات في التيرمينال (في السيرفر)
        res.json(order);  // يرسل البيانات إلى المتصفح (العميل)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
