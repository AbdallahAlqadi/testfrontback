const form = document.getElementById('productForm');

form.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    var nameproduct = document.getElementById('productName').value.trim();
    var price = document.getElementById('productPrice').value.trim();
    var img = document.getElementById('productImage').files[0];

    // تحقق من صحة المدخلات
    if (!nameproduct || !price || !img) {
        alert('يرجى ملء جميع الحقول'); // "Please fill all fields"
        return;
    }

    // تحقق من حجم الصورة
    if (img.size > 30 * 1024 * 1024) { // مثال: 5 ميجابايت
        alert('حجم الصورة يجب أن يكون أقل من 30 ميجابايت'); // "Image size must be less than 5 MB"
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        var imgData = reader.result; // Base64 image data
        PostREN(nameproduct, price, imgData); // Pass imgData instead of img
    }
    
    reader.readAsDataURL(img);
    alert('Done creat  product');

});

async function PostREN(nameproduct, price, imgData) {
    const data = { nameproduct: nameproduct, price: price, img: imgData }; // Use imgData here
    
    console.log('Data being sent:', data); // Log the data to be sent

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
        getData(); // Refresh data after successful post

    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ أثناء إرسال البيانات: ' + error.message); // "An error occurred while sending data"
    }
}

// Function to fetch data from the backend
async function getData() {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/data');
        const data = await response.json();

        const products = document.getElementById('products');
        products.innerHTML = ''; // Clear previous content

        data.forEach(info => {
            const productCard = `
                <div class="card">
                    <img src="${info.img}" alt="${info.nameproduct}" class="product-image">
                    <h2 class="product-name">${info.nameproduct}</h2>
                    <p class="product-price">$${info.price}</p>
                    <button style="width:170px;margin-left:70px" id="delete" onclick="deleteData('${info._id}')">Delete</button>
                                        <button style="width:170px;margin-left:70px" id="delete" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" >Update</button>

                </div>
            `;
            products.innerHTML += productCard;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example of deleteData function
async function deleteData(id) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/api/data/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Refresh the product list after deletion
            getData();
            alert('Product deleted successfully'); // Correct alert function
        } else {
            console.error('Failed to delete the product');
            alert('Failed to delete the product'); // Alert for deletion failure
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the product'); // Alert for unexpected errors
    }
}

// Call getData when the page loads
getData();

async function deleteData(id) {
    const url = `http://127.0.0.1:4000/api/data/${id}`; // استخدم const للـ URL
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'Deletion failed'}`);
        }

        getData(); // تحديث البيانات بعد الحذف

    } catch (error) {
        alert(`حدث خطأ أثناء الحذف: ${error.message} (ID: ${id})`); // بناء رسالة الخطأ بشكل صحيح
    }
}
