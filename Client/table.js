var tbody = document.getElementById('tbody'); // استخدام tbody بدلاً من trow
var count = 0; // استخدام count بدلاً من cont
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
            tbody.innerHTML = `<tr><td colspan="6">لا توجد طلبات متاحة</td></tr>`;
            return;
        }

        // استخدام map لإنشاء الصفوف
        const rows = data.map(order => {
            // إذا كانت قيمة createdAt موجودة بالفعل في الخريطة، استخدم نفس العداد
            if (orderCountMap[order.createdAt] !== undefined) {
                return `
                    <tr>
                        <td>${orderCountMap[order.createdAt]}</td>
                        <td>${order.name}</td>
                        <td>${order.price}</td>
                        <td>${order.count}</td>
                        <td>${order.total}</td>
                        <td>${order.createdAt}</td>
                    </tr>
                `;
            } else {
                // إذا لم تكن موجودة، قم بزيادتها وتخزينها في الخريطة
                orderCountMap[order.createdAt] = count++;
                return `
                    <tr>
                        <td>${orderCountMap[order.createdAt]}</td>
                        <td>${order.name}</td>
                        <td>${order.price}</td>
                        <td>${order.count}</td>
                        <td>${order.total}</td>
                        <td>${order.createdAt}</td>
                    </tr>
                `;
            }
        }).join(''); // دمج مصفوفة الصفوف في سلسلة واحدة

        tbody.innerHTML = rows; // تحديث الـ DOM
    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = `<tr><td colspan="6">فشل تحميل الطلبات</td></tr>`; // يجب تحديث العدد هنا أيضًا
    }
}

getData();
