var form = document.getElementById('form');

// عدد المحاولات المسموح بها قبل الحظر
const MAX_ATTEMPTS = 3;
// مدة الحظر بالمللي ثانية (5 دقائق)
const BLOCK_DURATION = 3 * 60 * 1000; // 5 دقائق

// استرجاع عدد المحاولات ووقت الحظر إذا كانت موجودة
let attempts = localStorage.getItem('attempts') ? parseInt(localStorage.getItem('attempts')) : 0;
let blockUntil = localStorage.getItem('blockUntil') ? parseInt(localStorage.getItem('blockUntil')) : 0;

// التحقق مما إذا كان المستخدم محظورًا
if (Date.now() < blockUntil) {
    // إذا كان المستخدم محظورًا، عرض رسالة
    showAlert("لقد تم حظرك مؤقتًا. يرجى الانتظار 3 دقائق.");
} else {
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        var users = document.getElementById('name').value;
        var password = document.getElementById('password').value;

        try {
            const response = await fetch('http://127.0.0.1:4000/api/signup');
            const data = await response.json();
            console.log(data);
            let isValidUser = false; // متغير لتتبع حالة المستخدم

            for (var i = 0; i < data.length; i++) {
                if (users === data[i].name && password === data[i].password) {
                    isValidUser = true; // إذا تم العثور على المستخدم
                    // إعادة تعيين عدد المحاولات عند تسجيل الدخول بنجاح
                    localStorage.removeItem('attempts');
                    localStorage.removeItem('blockUntil');
                    window.location.href = "showuser.html";     
                    break; // الخروج من الحلقة إذا تم العثور على المستخدم
                }
            }

            // إذا لم يتم العثور على المستخدم
            if (!isValidUser) {
                attempts++; // زيادة عدد المحاولات
                localStorage.setItem('attempts', attempts);

                // إذا تجاوز عدد المحاولات، حظر المستخدم
                if (attempts >= MAX_ATTEMPTS) {
                    blockUntil = Date.now() + BLOCK_DURATION; // تعيين وقت الحظر
                    localStorage.setItem('blockUntil', blockUntil);
                    showAlert("لقد تجاوزت عدد المحاولات. تم حظرك لمدة 5 دقائق.");
                } else {
                    showAlert("اسم المستخدم أو كلمة المرور غير صحيحة");
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
    });
}

function showAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: message,
        confirmButtonText: 'موافق'
    });
}
