const form = document.getElementById('productForm');

form.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const nameproduct = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const img = document.getElementById('productImage').files[0];

    // تحقق من صحة المدخلات
    if (!nameproduct || !price || !img) {
        Swal.fire({
            icon: 'warning',
            title: 'تحذير',
            text: 'يرجى ملء جميع الحقول',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    // تحقق من حجم الصورة
    if (img.size > 50 * 1024 * 1024) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حجم الصورة يجب أن يكون أقل من 50 ميجابايت',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    // تحقق من نوع الصورة (اختياري)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(img.type)) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'يرجى تحميل صورة بصيغة JPEG أو PNG أو GIF فقط',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    // تحقق من أن السعر هو عدد
    if (isNaN(price) || price <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'يرجى إدخال سعر صحيح',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = async function() {
        const imgData = reader.result;
        await PostREN(nameproduct, price, imgData);
        Swal.fire({
            icon: 'success',
            title: 'نجاح',
            text: 'تم إنشاء المنتج بنجاح',
            confirmButtonText: 'حسناً'
        });
    };

    reader.readAsDataURL(img);
});

async function PostREN(nameproduct, price, imgData) {
    const data = { nameproduct, price, img: imgData };

    try {
        const response = await fetch('http://127.0.0.1:4000/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data55 = await response.json();
        console.log('Success:', data55);

        // Reset the form fields
        form.reset(); 
        getData(); 

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء إرسال البيانات: ' + error.message,
            confirmButtonText: 'حسناً'
        });
    }
}

// Function to fetch data from the backend
async function getData() {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/data');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        const products = document.getElementById('products');
        products.innerHTML = '';

        data.forEach(info => {
            const productCard = `
                <div class="card">
                    <img src="${info.img}" alt="${info.nameproduct}" class="product-image">
                    <h2 class="product-name">${info.nameproduct}</h2>
                    <p class="product-price">$${info.price}</p>
                    <button style="width:170px;margin-left:70px" id="delete" onclick="deleteData('${info._id}')">حذف</button>
                    <button onclick="returnData('${info._id}', '${info.nameproduct}', '${info.price}', '${info.img}')" 
                            style="width:170px;margin-left:70px" 
                            class="btn btn-primary" 
                            data-bs-toggle="modal" 
                            data-bs-target="#exampleModal">تعديل</button>
                </div>
            `;
            products.innerHTML += productCard;
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء جلب البيانات: ' + error.message,
            confirmButtonText: 'حسناً'
        });
    }
}

// Example of deleteData function
async function deleteData(id) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/api/data/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            getData();
            Swal.fire({
                icon: 'success',
                title: 'نجاح',
                text: 'تم حذف المنتج بنجاح',
                confirmButtonText: 'حسناً'
            });
        } else {
            console.error('فشل في حذف المنتج');
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'فشل في حذف المنتج',
                confirmButtonText: 'حسناً'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء حذف المنتج',
            confirmButtonText: 'حسناً'
        });
    }
}

// Call getData when the page loads
getData();

let productId;
async function returnData(id, name, price, img) {
    productId = id;
    document.getElementById('updatename').value = name;
    document.getElementById('updateprice').value = price;
    
    // Set img preview
    document.getElementById('updateimgPreview').src = img;
}

document.getElementById('change').addEventListener('click', async function(e) {
    e.preventDefault();

    const nameproduct = document.getElementById('updatename').value.trim();
    const price = document.getElementById('updateprice').value.trim();
    const imgFile = document.getElementById('updateimg').files[0];

    if (!nameproduct || !price || !imgFile) {
        Swal.fire({
            icon: 'warning',
            title: 'تحذير',
            text: 'يرجى ملء جميع الحقول',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = async function() {
        const imgData = reader.result;

        const data = { 
            nameproduct, 
            price, 
            img: imgData
        };

        try {
            const response = await fetch(`http://127.0.0.1:4000/api/data/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Error: ${response.status} - ${errorDetails.message || 'Unknown error'}`);
            }

            Swal.fire({
                icon: 'success',
                title: 'نجاح',
                text: 'تم التحديث بنجاح',
                confirmButtonText: 'حسناً'
            });
            getData();

            // إغلاق نافذة المودال بعد نجاح التحديث
            const modal = document.getElementById('exampleModal');
            const bootstrapModal = bootstrap.Modal.getInstance(modal); // استخدام getInstance بدلاً من new Modal
            bootstrapModal.hide();

        } catch (error) {
            console.error('Error:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء التحديث: ' + error.message,
                confirmButtonText: 'حسناً'
            });
        }
    };

    reader.readAsDataURL(imgFile);
});
