var listitem = document.getElementById('listitem');
var cart = [];
var cartIcon = document.getElementById('cart-icon');
var cartCount = document.getElementById('cart-count');
var cartModal = document.getElementById('cart-modal');
var cartItemsList = document.getElementById('cart-items');
var checkoutButton = document.getElementById('checkout-button');
var closeCartButton = document.getElementById('close-cart');

// Fetch product data
async function getData() {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/data'); // Ensure the URL is correct
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
                    <button class="add-item-btn" data-name="${info.nameproduct}" data-price="${info.price}">إضافة إلى السلة</button>
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
    } catch (error) {
        console.error('Error:', error);
        listitem.innerHTML = `<p>فشل تحميل بيانات المنتج. يرجى المحاولة مرة أخرى لاحقًا.</p>`;
    }
}

// Show custom alert message
function showAlert(message) {
    const alertMessage = document.getElementById('alert-message');
    const customAlert = document.getElementById('custom-alert');

    alertMessage.textContent = message;
    customAlert.style.display = 'block';

    const closeButton = document.getElementById('alert-close');
    closeButton.onclick = function() {
        customAlert.style.display = 'none';
    };
}

// Add to cart
function addToCart(event) {
    const productName = event.target.getAttribute('data-name');
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
                quantity: quantity
            });
        }

        updateCart();
        // Reset quantity display
        document.getElementById(`count-${productName}`).textContent = '0';
        document.getElementById(`quantity-${productName}`).textContent = `(x${existingProduct ? existingProduct.quantity : quantity})`;
        document.getElementById(`quantity-${productName}`).style.display = 'block';
    } else {
        showAlert('يرجى تحديد كمية صحيحة.');
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
    }
    countDisplay.textContent = currentCount;
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
            const totalPrice = (item.price * item.quantity).toFixed(2);
            listItem.textContent = `${item.name} (x${item.quantity}) - $${item.price} each, Total: $${totalPrice}`;
            cartItemsList.appendChild(listItem);
        });
    } else {
        cartItemsList.innerHTML = '<li>سلتك فارغة</li>'; // Message if the cart is empty
    }

    // Show the cart modal
    cartModal.style.display = 'block';
});

// Close cart modal
closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Checkout button event
checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        fetch('http://127.0.0.1:4000/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cart)
        }).then(response => {
            if (response.ok) {
                alert('تم تقديم الطلب بنجاح!');
                cart = [];
                updateCart();
                cartModal.style.display = 'none';
            } else {
                showAlert('فشل تقديم الطلب');
            }
        }).catch(error => console.error('Error:', error));
    } else {
        showAlert('سلتك فارغة. يرجى إضافة عناصر قبل تقديم الطلب.'); // Alert when cart is empty during checkout
    }
});

// Fetch product data on page load
getData();
