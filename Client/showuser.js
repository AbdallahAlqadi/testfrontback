var listitem = document.getElementById('listitem');
var cart = [];
var cartIcon = document.getElementById('cart-icon');
var cartCount = document.getElementById('cart-count');
var cartModal = document.getElementById('cart-modal');
var cartItemsList = document.getElementById('cart-items');
var checkoutButton = document.getElementById('checkout-button');
var closeCartButton = document.getElementById('close-cart');
var clearCartButton = document.getElementById('clear-cart-button');

// Fetch product data
async function getData() {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/data');
        if (!response.ok) throw new Error('Network response was not ok');
        const information = await response.json();

        let content = '';

        information.forEach(info => {
            content += `
                <div class="card">
                    <img src="${info.img}" alt="${info.nameproduct}" class="product-image">
                    <h2 class="product-name">${info.nameproduct}</h2>
                    <p class="product-price">$${info.price}</p>
                    <div class="quantity-controls">
                        <button class="decrease-btn" data-name="${info.nameproduct}">-</button>
                        <span id="count-${info.nameproduct}" class="count-display">0</span>
                        <button class="increase-btn" data-name="${info.nameproduct}">+</button>
                    </div>
                    <button class="add-item-btn" data-name="${info.nameproduct}" data-price="${info.price}" data-img="${info.img}">إضافة إلى السلة</button>
                    <button class="show-ingredients-btn" data-name="${info.nameproduct}">عرض المكونات</button>
                </div>
            `;
        });

        listitem.innerHTML = content;

        document.querySelectorAll('.add-item-btn').forEach(btn => {
            btn.addEventListener('click', addToCart);
        });

        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });

        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });

        document.querySelectorAll('.show-ingredients-btn').forEach(btn => {
            btn.addEventListener('click', showIngredients);
        });
    } catch (error) {
        console.error('Error:', error);
        listitem.innerHTML = `<p>فشل تحميل بيانات المنتج. يرجى المحاولة مرة أخرى لاحقًا.</p>`;
    }
}
getData();

// Show custom alert message using SweetAlert2
function showAlert(message, icon = 'info', title = 'تنبيه') {
    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        confirmButtonText: 'موافق',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

// Add to cart
function addToCart(event) {
    const productName = event.target.getAttribute('data-name');
    const productImage = event.target.getAttribute('data-img');
    const quantity = parseInt(document.getElementById(`count-${productName}`).textContent);

    if (quantity <= 0) {
        showAlert('يرجى تحديد كمية أكبر من صفر قبل إضافة المنتج إلى السلة.', 'warning');
        return; // Don't add the product to cart if quantity is 0 or invalid
    }

    const productPrice = parseFloat(event.target.getAttribute('data-price')).toFixed(2);
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: quantity,
            img: productImage
        });
    }

    updateCart();
    document.getElementById(`count-${productName}`).textContent = '0'; // Reset quantity to 0 after adding to cart
}

// Increase product quantity
function increaseQuantity(event) {
    const productName = event.target.getAttribute('data-name');
    const countDisplay = document.getElementById(`count-${productName}`);
    let currentCount = parseInt(countDisplay.textContent);
    currentCount += 1;
    countDisplay.textContent = currentCount;

    // Update quantity in the cart
    const product = cart.find(item => item.name === productName);
    if (product) product.quantity = currentCount; // Update quantity in cart
}

// Decrease product quantity
function decreaseQuantity(event) {
    const productName = event.target.getAttribute('data-name');
    const countDisplay = document.getElementById(`count-${productName}`);
    let currentCount = parseInt(countDisplay.textContent);
    if (currentCount > 0) {
        currentCount -= 1;
        countDisplay.textContent = currentCount;

        // Update quantity in the cart
        const product = cart.find(item => item.name === productName);
        if (product) product.quantity = currentCount; // Update quantity in cart
    } else {
        showAlert('لا يمكنك تقليل الكمية لأن الكمية الحالية هي صفر.', 'warning');
    }
}

// Update cart count and display
function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Open cart modal
cartIcon.addEventListener('click', () => {
    cartItemsList.innerHTML = ''; // Clear previous items
    if (cart.length > 0) {
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-image" style="width: 50px; height: 50px; margin-right: 10px;">
                ${item.name} (x${item.quantity}) - $${item.price} each, Total: $${(item.price * item.quantity).toFixed(2)}
            `;
            cartItemsList.appendChild(listItem);
        });
    } else {
        cartItemsList.innerHTML = '<li>سلتك فارغة</li>';
    }

    cartModal.style.display = 'block';
});

// Close cart modal
closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Clear Cart button event
clearCartButton.addEventListener('click', () => {
    if (cart.length > 0) {
        cart = [];
        updateCart();
        cartItemsList.innerHTML = '<li>سلتك فارغة</li>';
        showAlert('تم إفراغ السلة.', 'success');
    } else {
        showAlert('سلتك فارغة بالفعل.', 'info');
    }
});

// Checkout button event
checkoutButton.addEventListener('click', () => {
    showPaymentOptions(); // Show the payment options
});

// Show Payment Options (show only payment method, not sending it to backend)
// Show Payment Options (show only payment method, not sending it to backend)
function showPaymentOptions() {
    Swal.fire({
        title: 'اختر طريقة الدفع',
        text: 'اختر ما إذا كنت تريد الدفع الآن باستخدام VISA أو الدفع المباشر عند الاستلام',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'دفع باستخدام VISA',
        cancelButtonText: 'الدفع عند الاستلام'
    }).then((result) => {
        let paymentMethod = '';

        if (result.isConfirmed) {
            paymentMethod = 'VISA'; // تم اختيار الدفع باستخدام VISA
            showAlert('تم اختيار الدفع باستخدام VISA', 'success', 'اختيار طريقة الدفع');
        } else {
            paymentMethod = 'Cash on delivery'; // تم اختيار الدفع عند الاستلام
            showAlert('تم اختيار الدفع عند الاستلام', 'success', 'اختيار طريقة الدفع');
        }

        confirmOrder(); // تمرير طلب الدفع بدون نوع الدفع
    });
}

async function confirmOrder() {
    if (cart.length > 0) {
        const orderData = cart.map(item => ({
            name: item.name,
            price: parseFloat(item.price), // تأكد من تحويل السعر إلى رقم عشري
            count: item.quantity, // الكمية
            total: (item.price * item.quantity).toFixed(2), // حساب الإجمالي لكل منتج
        }));

        console.log('Order Data:', orderData); // سيتم طباعة بيانات الطلب في وحدة التحكم لتأكد من صحتها

        try {
            // إرسال البيانات إلى الخادم بدون نوع الدفع
            const response = await fetch('http://127.0.0.1:4000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order: orderData // إرسال فقط بيانات الطلب بدون نوع الدفع
                }),
            });

            // إذا كانت الاستجابة غير صحيحة
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Server Response Error:', errorMessage); // طباعة الخطأ في وحدة التحكم
                showAlert(`فشل تقديم الطلب: ${errorMessage}`, 'error', 'خطأ');
                return;
            }

            // إذا كانت الاستجابة ناجحة
            const responseData = await response.json();
            console.log('Response Data:', responseData);

            showAlert('تم تقديم الطلب بنجاح!', 'success', 'نجاح');
            cart = []; // تفريغ السلة
            updateCart(); // تحديث عرض السلة
            cartModal.style.display = 'none'; // إغلاق نافذة السلة
        } catch (error) {
            console.error('Error during checkout:', error);
            showAlert('حدث خطأ أثناء تقديم الطلب. يرجى التحقق من اتصالك بالإنترنت.', 'error', 'خطأ');
        }
    } else {
        showAlert('سلتك فارغة. يرجى إضافة عناصر قبل تقديم الطلب.', 'warning');
    }
}



// Show ingredients for the selected product
function showIngredients(event) {
    const productName = event.target.getAttribute('data-name');
    let ingredients = [];

    // Define ingredients for each product (adjust as needed)
    switch (productName) {
        case 'برغر1':
            ingredients = ['خبز برغر', 'لحم برغر', 'جبنة', 'خس', 'طماطم', 'بصل', 'مخلل'];
            break;
        case 'زنجر':
            ingredients = ['خبز', 'قطع دجاج مقلية', 'جبنة', 'خس', 'طماطم', 'مايونيز', 'خيار مخلل'];
            break;
        case 'دجاج مشوي':
            ingredients = ['دجاج مشوي', 'رز', 'خضار مشوية', 'سلطة'];
            break;
        case 'ستيك':
            ingredients = ['لحم ستيك', 'بطاطس مقلية', 'خضار مشوية', 'صلصة'];
            break;
        case 'سمك':
            ingredients = ['سمك مشوي', 'أرز', 'خضار مشوية', 'صلصة ليمون'];
            break;
        case 'شاورما':
            ingredients = ['خبز عربي', 'دجاج مشوي', 'طماطم', 'خس', 'صوص الثوم', 'مخلل'];
            break;
        default:
            ingredients = ['مكونات غير متوفرة'];
            break;
    }
    

    Swal.fire({
        title: 'المكونات',
        text: ingredients.join(', '),
        icon: 'info'
    });
}



function confirmCall(phoneNumber) {
    Swal.fire({
        title: 'تأكيد الاتصال',
        text: `هل تريد الاتصال بالرقم ${phoneNumber}؟`, // استخدام القوسين العكسيين ` (backticks) للجملة النصية
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نعم، اتصال',
        cancelButtonText: 'إلغاء',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `tel:${phoneNumber}`; // استخدام القوسين العكسيين لتنسيق الرابط
        }
    });
}
