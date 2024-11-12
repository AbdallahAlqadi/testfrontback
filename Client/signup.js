var form = document.getElementById('form');

// post
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confpassword: document.getElementById('confpassword').value
    };

    // التحقق من تطابق كلمة المرور
    if (userData.password !== userData.confpassword) {
        await Swal.fire({
            icon: 'error',
            title: 'عفواً...',
            text: 'كلمات المرور غير متطابقة.'
        });
        return; // توقف عن إرسال النموذج
    }

    // التحقق من قوة كلمة المرور
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // يجب أن تحتوي على 8 أحرف على الأقل، حرف واحد، رقم واحد ورمز واحد
    if (!passwordPattern.test(userData.password)) {
        await Swal.fire({
            icon: 'error',
            title: 'كلمة مرور غير صالحة',
            text: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، تشمل حرف واحد ورقم واحد ورمز واحد.'
        });
        return; // توقف عن إرسال النموذج
    }

    try {
        const response = await fetch('http://127.0.0.1:4000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error(`خطأ: ${response.status}`);

        const data = await response.json();
        console.log('نجاح:', data);
         window.location.href="login.html"
        await Swal.fire({
            icon: 'success',
            title: 'تم التسجيل بنجاح!',
            text: 'لقد تم تسجيلك بنجاح.'
           
        });

        // مسح الحقول فقط عند النجاح
        form.reset();

    } catch (error) {
        console.error('خطأ:', error);
        await Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء التسجيل. تحقق من البيانات المدخلة.'
        });

        // يمكنك مسح الحقول هنا أيضاً إذا رغبت
        document.getElementById('password').value = '';
        document.getElementById('confpassword').value = '';
    }
});

// خاصية إظهار كلمة المرور
document.getElementById('togglePassword1').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🚫'; // تغيير الرمز حسب حالة كلمة المرور
});

document.getElementById('togglePassword2').addEventListener('click', function () {
    const confirmPasswordField = document.getElementById('confpassword');
    const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordField.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🚫'; // تغيير الرمز حسب حالة كلمة المرور
});
