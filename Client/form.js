const form = document.getElementById('productForm');

form.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    var nameproduct = document.getElementById('productName').value.trim();
    var price = document.getElementById('productPrice').value.trim();
    var img = document.getElementById('productImage').files[0];

    // تحقق من صحة المدخلات
    if (!nameproduct || !price || !img) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    // تحقق من حجم الصورة
    if (img.size > 30 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 30 ميجابايت');
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        var imgData = reader.result;
        PostREN(nameproduct, price, imgData);
    }
    
    reader.readAsDataURL(img);
    alert('تم إنشاء المنتج بنجاح');
});

async function PostREN(nameproduct, price, imgData) {
    const data = { nameproduct: nameproduct, price: price, img: imgData };

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
        alert('حدث خطأ أثناء إرسال البيانات: ' + error.message);
    }
}

// Function to fetch data from the backend
async function getData() {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/data');
        const data = await response.json();

        const products = document.getElementById('products');
        products.innerHTML = '';

        data.forEach(info => {
            const productCard = `
                <div class="card">
                    <img src="${info.img}" alt="${info.nameproduct}" class="product-image">
                    <h2 class="product-name">${info.nameproduct}</h2>
                    <p class="product-price">$${info.price}</p>
                    <button style="width:170px;margin-left:70px" id="delete" onclick="deleteData('${info._id}')">Delete</button>
                    <button onclick="returnData('${info._id}', '${info.nameproduct}', '${info.price}', '${info.img}')" 
                            style="width:170px;margin-left:70px" 
                            class="btn btn-primary" 
                            data-bs-toggle="modal" 
                            data-bs-target="#exampleModal">Update</button>
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
            getData();
            alert('Product deleted successfully');
        } else {
            console.error('Failed to delete the product');
            alert('Failed to delete the product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the product');
    }
}

// Call getData when the page loads
getData();

var productId;
async function returnData(id, name, price, img) {
    productId = id;
    document.getElementById('updatename').value = name;
    document.getElementById('updateprice').value = price;
    
    // Set img preview
    document.getElementById('updateimgPreview').src = img;
}

document.getElementById('change').addEventListener('click', async function(e) {
    e.preventDefault();

    var nameproduct = document.getElementById('updatename').value.trim();
    var price = document.getElementById('updateprice').value.trim();
    var imgFile = document.getElementById('updateimg').files[0];
    
    if (!nameproduct || !price || !imgFile) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function() {
        const imgData = reader.result;

        const data = { 
            nameproduct: nameproduct, 
            price: price, 
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

            alert('Update Success');
            getData();

            // اغلاق نافذة المودال بعد نجاح التحديث
            const modal = document.getElementById('exampleModal');
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();

        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    
    reader.readAsDataURL(imgFile);
});
