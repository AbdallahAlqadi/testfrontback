var form2 = document.getElementById('form');

// التحقق مما إذا كان المستخدم محظورًا


form2.addEventListener('submit', async function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    var user = document.getElementById('name').value;
    var password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:4000/api/superviser');
        
        

        const data = await response.json();
        console.log(data);
        let isValidUser = false; // متغير لتتبع حالة المستخدم

        for (var i = 0; i < data.length; i++) {
            if (user == data[i].name && password == data[i].password) {
                isValidUser = true; // إذا تم العثور على المستخدم
                window.location.href = "form.html";
                localStorage.setItem('user', user);

                break; // الخروج من الحلقة إذا تم العثور على المستخدم
            }
        }

        // إذا لم يتم العثور على المستخدم
        if (!isValidUser) {
            showAlert("اسم المستخدم أو كلمة المرور غير صحيحة. حاول مرة أخرى.");
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert("حدث خطأ أثناء محاولة الاتصال بالخادم. يرجى المحاولة لاحقًا.");
    }
});

function showAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: message,
        confirmButtonText: 'موافق',
        customClass: {
            confirmButton: 'custom-confirm-button' // إضافة فئة مخصصة للزر
        }
    });
}

// CSS مخصص لتعديل حجم زر "موافق"
const style = document.createElement('style');
style.innerHTML = `
.custom-confirm-button {
    font-size: 16px; /* تغيير حجم الخط */
    padding: 10px 20px; /* تغيير الحشوة */
    min-width: 120px; /* تعيين عرض أدنى */
}
`;
document.head.appendChild(style);
