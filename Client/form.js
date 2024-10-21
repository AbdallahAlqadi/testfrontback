const form = document.getElementById('productForm');




form.addEventListener('submit', async function (e) {
    e.preventDefault(); 

   
    const userData = {
        nameproduct: document.getElementById('productName').value,
        price:document.getElementById('productPrice').value,
        img: document.getElementById('productImage').files[0]
    };

    try {
        const response = await fetch('http://127.0.0.1:4000/api/data', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        console.log('Success:', data);
        getData(); 

        // مسح الحقول
        form.reset();
    

    } catch (error) {
        console.error('Error:', error);
        
    }
});
