document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (files.length === 0) {
        return alert('Please select a file.');
    }

    const fileName = prompt('Please enter a name for the file:');
    if (!fileName) {
        return alert('Please enter a name for the file.');
    }

    const formData = new FormData();
    
    // Loop through the selected files and append them to formData
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Example of file type validation (optional)
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Add other types as needed
        if (!allowedTypes.includes(file.type)) {
            return alert(`File type not allowed: ${file.type}. Please select a valid file.`);
        }

        formData.append('files[]', file); // Append files as an array if handling multiple
    }
    
    formData.append('fileName', fileName);

    try {
        const response = await fetch('http://127.0.0.1:5009/api/data', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file.');
        }

        const filesResponse = await response.json();

        // Display uploaded files
        const fileViewer = document.getElementById('fileViewer');
        fileViewer.innerHTML = ''; // Clear previous content

        filesResponse.forEach(({ fileName, fileUrl }) => {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank';
            link.textContent = fileName;
            fileViewer.appendChild(link);
            fileViewer.appendChild(document.createElement('br'));
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error: ' + error.message);
    }
});
