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
                acc[order.createdAt] = {
                    createdAt: order.createdAt,
                    items: []
                };
            }

            acc[order.createdAt].items.push(order);
            return acc;
        }, {});

        // إنشاء الصفوف بناءً على التجميع
        const rows = Object.keys(groupedOrders).map((createdAt, index) => {
          const orders = groupedOrders[createdAt].items;
      
          // جمع كل البيانات للأصناف في نفس الأعمدة 
          const names = orders.map(order => order.name).join(', ');
          const prices = orders.map(order => order.price).join(', ');
          const counts = orders.map(order => order.count).join(', ');
          const totals = orders.map(order => order.total).join(', ');
      
          // حساب مجموع total لكل الطلبات في نفس الصف
          const totalSum = orders.reduce((sum, order) => sum + order.total, 0);
      
          // تنسيق الوقت والتاريخ بدون تفاصيل إضافية
          const dateObj = new Date(createdAt);
          const formattedDate = dateObj.toLocaleDateString(); 
          const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
          return `
              <tr>
                  <td>${index + 1}</td>
                  <td>${names}</td>
                  <td>${prices}</td>
                  <td>${counts}</td>
                  <td>${totals}</td>
                  <td>${totalSum}</td>
                  <td>${formattedDate} ${formattedTime}</td>
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

// تحديث البيانات كل 5 ثوانٍ
setInterval(getData, 5000);

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
