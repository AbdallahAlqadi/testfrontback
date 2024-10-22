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
        const response = await fetch('http://127.0.0.1:4000/api/data');
        const information = await response.json();

        let content = '';

        information.forEach(info => {
            content += `
                <div class="card">
                    <img src="${info.img}" alt="${info.nameproduct}" class="product-image">
                    <h2 class="product-name">${info.nameproduct}</h2>
                    <p class="product-price">$${info.price}</p>
                    <button class="add-item-btn" data-name="${info.nameproduct}" data-price="${info.price}">إضافة إلى السلة</button>
                </div>
            `;
        });

        listitem.innerHTML = content;

        document.querySelectorAll('.add-item-btn').forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
    } catch (error) {
        console.error('Error:', error);
        listitem.innerHTML = `<p>فشل تحميل بيانات المنتج. يرجى المحاولة مرة أخرى لاحقًا.</p>`;
    }
}

// Add to cart
function addToCart(event) {
    const productName = event.target.getAttribute('data-name');
    const productPrice = parseFloat(event.target.getAttribute('data-price')).toFixed(2);

    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    updateCart();
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
            listItem.textContent = `${item.name} (x${item.quantity}) - $${item.price} each`;
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
                alert('فشل تقديم الطلب');
            }
        }).catch(error => console.error('Error:', error));
    }
});

getData();
