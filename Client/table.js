var tbody = document.getElementById('tbody');
var orderCountMap = {}; // خريطة لتخزين الأوقات وعددها

async function getData() {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/order');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();

        // التحقق مما إذا كانت البيانات فارغة
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7">لا توجد طلبات متاحة</td></tr>`;
            return;
        }

        // تجميع الطلبات حسب الوقت createdAt
        const groupedOrders = data.reduce((acc, order) => {
            if (!acc[order.createdAt]) {
                acc[order.createdAt] = [];
            }
            acc[order.createdAt].push(order);
            return acc;
        }, {});

        // إنشاء الصفوف بناءً على التجميع
        const rows = Object.keys(groupedOrders).map((createdAt, index) => {
            const orders = groupedOrders[createdAt];
            const names = orders.map(order => order.name).join(', ');
            const prices = orders.map(order => order.price).join(', ');
            const counts = orders.map(order => order.count).join(', ');
            const totals = orders.map(order => order.total).join(', ');

            // حساب مجموع total لكل الطلبات في نفس الصف
            const totalSum = orders.reduce((sum, order) => sum + order.total, 0);

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${names}</td>
                    <td>${prices}</td>
                    <td>${counts}</td>
                    <td>${totals}</td>
                     <td>${totalSum}</td> <!-- عمود مجموع total لكل الطلبات -->
                    <td>${createdAt}</td>
                   
                </tr>
            `;
        }).join('');

        tbody.innerHTML = rows; // تحديث الـ DOM
    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = `<tr><td colspan="7">فشل تحميل الطلبات</td></tr>`;
    }
}

getData();
