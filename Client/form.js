document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const fileName = prompt('Please enter a name for the file:'); // طلب اسم الملف من المستخدم
    if (!file) return alert('Please select a file.');
    if (!fileName) return alert('Please enter a name for the file.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName); // إضافة اسم الملف إلى البيانات المرسلة

    try {
        // رفع الملف إلى السيرفر
        const response = await fetch('http://localhost:5007/api/data', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload file.');

        // استلام الملفات مع الأسماء
        const files = await response.json();
        
        // عرض الملفات في الواجهة الأمامية
        const fileViewer = document.getElementById('fileViewer');
        fileViewer.innerHTML = ''; // تفريغ المحتوى السابق
        files.forEach(({ fileName, fileUrl }) => {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank';
            link.textContent = fileName;
            fileViewer.appendChild(link);
            fileViewer.appendChild(document.createElement('br')); // إضافة فاصل بين الروابط
        });
    } catch (error) {
        console.error('Error uploading file:', error);
    }
});
