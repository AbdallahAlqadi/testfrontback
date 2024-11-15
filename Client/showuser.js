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

// استرجاع اسم المستخدم من localStorage
let username = localStorage.getItem('user');

// الحصول على العنصر بواسطة الـ ID
var x1 = document.getElementById('x1');

// عرض اسم المستخدم داخل العنصر
x1.innerHTML = username ? `مرحباً ${username}!` : 'مرحباً زائر';  // إذا كان هناك اسم مستخدم، يتم عرضه، وإلا يعرض "زائر"


// Add to cart
function addToCart(event) {
    const productName = event.target.getAttribute('data-name');
    const productImage = event.target.getAttribute('data-img');
    const quantity = parseInt(document.getElementById(`count-${productName}`).textContent);

    if (quantity > 0) {
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
        document.getElementById(`count-${productName}`).textContent = '0';
    } else {
        showAlert('يرجى تحديد كمية صحيحة.', 'warning');
    }
}

// Increase product quantity
function increaseQuantity(event) {
    const productName = event.target.getAttribute('data-name');
    const countDisplay = document.getElementById(`count-${productName}`);
    let currentCount = parseInt(countDisplay.textContent);
    currentCount += 1;
    countDisplay.textContent = currentCount;
}

// Decrease product quantity
function decreaseQuantity(event) {
    const productName = event.target.getAttribute('data-name');
    const countDisplay = document.getElementById(`count-${productName}`);
    let currentCount = parseInt(countDisplay.textContent);
    if (currentCount > 0) {
        currentCount -= 1;
        countDisplay.textContent = currentCount;
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
checkoutButton.addEventListener('click', async () => {
    if (cart.length > 0) {
        const orderData = cart.map(item => ({
            name: item.name,
            price: parseFloat(item.price),
            count: item.quantity,
            total: (item.price * item.quantity).toFixed(2)
        }));

        console.log('Order Data:', orderData);
        
        try {
            const response = await fetch('http://127.0.0.1:4000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                showAlert(`فشل تقديم الطلب: ${errorMessage}`, 'error', 'خطأ');
                return;
            }

            const responseData = await response.json();
            console.log('Response Data:', responseData);

            showAlert('تم تقديم الطلب بنجاح!', 'success', 'نجاح');
            cart = [];
            updateCart();
            cartModal.style.display = 'none';
        } catch (error) {
            console.error('Error during checkout:', error);
            showAlert('حدث خطأ أثناء تقديم الطلب. يرجى التحقق من اتصالك بالإنترنت.', 'error', 'خطأ');
        }
    } else {
        showAlert('سلتك فارغة. يرجى إضافة عناصر قبل تقديم الطلب.', 'warning');
    }
});

// Show Ingredients Function
function showIngredients(event) {
    const productName = event.target.getAttribute('data-name');

    // تخمين المكونات بناءً على اسم الأكلة
    switch (productName) {
        case 'برغر':
            ingredients = ['خبز برغر', 'لحم برغر', 'جبنة', 'خس', 'طماطم', 'بصل', 'مخلل'];
            break;
        case 'زنجر':
            ingredients = ['خبز', 'قطع دجاج مقلية', 'جبنة', 'خس', 'طماطم', 'مايونيز', 'خيار مخلل'];
            break;
        case 'دجاج مشوي':
            ingredients = ['دجاج مشوي', 'أرز', 'خضار مشوية', 'صلصة الليمون والثوم'];
            break;
        case 'شاورما':
            ingredients = ['خبز شاورما', 'لحم شاورما (دجاج أو لحم)', 'بقدونس', 'طماطم', 'صلصة الثوم', 'مخلل'];
            break;
        case 'ستيك':
            ingredients = ['ستيك لحم', 'بطاطس مهروسة', 'خضار سوتيه', 'صلصة الفلفل'];
            break;
        case 'سمك':
            ingredients = ['سمك مشوي أو مقلي', 'أرز', 'ليمون', 'خضار مشوية أو سوتيه', 'صلصة الطرطار'];
            break;
        case 'بروستد':
            ingredients = ['دجاج بروستد', 'بطاطس مقلية', 'خبز', 'صلصة البروستد', 'خيار مخلل', 'كولسلو'];
            break;
        default:
            ingredients = ['مكونات غير معروفة لهذه الأكلة'];
    }
    
    

    // عرض المكونات في نافذة SweetAlert
    Swal.fire({
        title: `مكونات ${productName}`,
        html: `<ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>`,
        icon: 'info',
        confirmButtonText: 'موافق',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

// Fetch product data on page load
getData();

function confirmCall(phoneNumber) {
    Swal.fire({
        title: 'تأكيد الاتصال',
        text: `هل تريد الاتصال بالرقم ${phoneNumber}؟`,
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
            window.location.href = `tel:${phoneNumber}`;
        }
    });
}
