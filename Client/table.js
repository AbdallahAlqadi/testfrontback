var tbody = document.getElementById('tbody');

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
                acc[order.createdAt] = {};
            }

            // تجميع الطلبات حسب اسم المنتج في نفس الوقت
            if (!acc[order.createdAt][order.name]) {
                acc[order.createdAt][order.name] = {
                    name: order.name,
                    price: order.price,
                    count: 0,
                    total: 0,
                };
            }

            // زيادة العدد الكلي و المجموع الكلي لنفس المنتج
            acc[order.createdAt][order.name].count += order.count;
            acc[order.createdAt][order.name].total += order.total;
            return acc;
        }, {});

        // إنشاء الصفوف بناءً على التجميع
        const rows = Object.keys(groupedOrders).map((createdAt, index) => {
            const orders = groupedOrders[createdAt];
            const names = Object.values(orders).map(order => order.name).join(', ');
            const prices = Object.values(orders).map(order => order.price).join(', ');
            const counts = Object.values(orders).map(order => order.count).join(', ');
            const totals = Object.values(orders).map(order => order.total).join(', ');

            // حساب مجموع total لكل الطلبات في نفس الصف
            const totalSum = Object.values(orders).reduce((sum, order) => sum + order.total, 0);

            // تنسيق الوقت والتاريخ بدون تفاصيل إضافية
            const dateObj = new Date(createdAt);
            const formattedDate = dateObj.toLocaleDateString(); // عرض التاريخ
            const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // عرض الوقت بساعات ودقائق

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${names}</td>
                    <td>${prices}</td>
                    <td>${counts}</td>
                    <td>${totals}</td>
                    <td>${totalSum}</td> <!-- عمود مجموع total لكل الطلبات -->
                    <td>${formattedDate} ${formattedTime}</td> <!-- الوقت والتاريخ بتنسيق مبسط -->
                </tr>
            `;
        }).join('');

        tbody.innerHTML = rows; // تحديث الـ DOM
    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = `<tr><td colspan="7">فشل تحميل الطلبات</td></tr>`;
    }
}

// استدعاء getData أول مرة
getData();

// استدعاء getData كل 5 ثوانٍ (3000 مللي ثانية)
setInterval(getData, 3000);

const deleteData = async () => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "هل تريد حذف جميع البيانات؟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'لا، إلغاء',
      reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch('http://127.0.0.1:4000/api/order', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const data = await response.json();
          console.error(data.message);
          Swal.fire('خطأ', data.message, 'error'); 
          return;
        }
  
        const data = await response.json();
        Swal.fire('تم الحذف', data.message, 'success'); 
        getData(); // تحديث البيانات بعد الحذف
  
      } catch (error) {
        console.error('Error deleting data:', error);
        Swal.fire('خطأ', 'حدث خطأ أثناء الحذف', 'error'); 
      }
    } else {
      Swal.fire('إلغاء', 'لم يتم حذف البيانات', 'info');
    }
};
