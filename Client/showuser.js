var listitem = document.getElementById('listitem');

async function getData() {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/data');
        const information = await response.json();

        // اجمع جميع العناصر في متغير واحد
        let content = '';

        information.forEach(info => {
            content += `
                <div class="card">
                    <img src="${info.img}" alt="${info.nameproduct}" class="product-image">
                    <h2 class="product-name">${info.nameproduct}</h2>
                    <p class="product-price">$${info.price}</p>
            <button>Add Item</button>
                </div>
            `;
        });

        // بعد الانتهاء من التجميع، قم بتعيين المحتوى إلى innerHTML مرة واحدة
        listitem.innerHTML = content;
    } catch (error) {
        console.error('Error:', error);
    }
}

getData();
