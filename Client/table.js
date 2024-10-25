var tbody = document.getElementById('tbody'); // استخدام tbody بدلاً من trow

async function getData() {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/order');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();

        // التحقق مما إذا كانت البيانات فارغة
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">لا توجد طلبات متاحة</td></tr>`;
            return;
        }

        // استخدام map لإنشاء الصفوف
        const rows = data.map(order => `
            <tr>
                <td>${order.name}</td>
                <td>${order.price}</td>
                <td>${order.count}</td>
                <td>${order.total}</td>
                                <td>${order.createdAt}</td>

            </tr>
        `).join(''); // دمج مصفوفة الصفوف في سلسلة واحدة

        tbody.innerHTML = rows; // تحديث الـ DOM

    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = `<tr><td colspan="4">فشل تحميل الطلبات</td></tr>`;
    }
}

getData();
