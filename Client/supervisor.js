var form = document.getElementById('form');

form.addEventListener('submit', async function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    var users = document.getElementById('name').value;
    var password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:4000/api/signup');
        const data = await response.json();

        let isValidUser = false; // متغير لتتبع حالة المستخدم

        for (var i = 0; i < data.length; i++) {
            if (users === data[i].name && password === data[i].password) {
                isValidUser = true; // إذا تم العثور على المستخدم
                window.location.href = "form.html";     
                break; // الخروج من الحلقة إذا تم العثور على المستخدم
            }
        }

        // إذا لم يتم العثور على المستخدم، عرض رسالة الخطأ باستخدام SweetAlert2
        if (!isValidUser) {
            showAlert("اسم المستخدم أو كلمة المرور غير صحيحة");
        }

    } catch (error) {
        console.error('Error:', error);
    }
});

function showAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: message,
        confirmButtonText: 'موافق'
    });
}
