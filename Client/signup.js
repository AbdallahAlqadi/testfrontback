var form = document.getElementById('form');

// post
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confpassword: document.getElementById('confpassword').value
    };

    // Validation for password
    if (userData.password !== userData.confpassword) {
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Passwords do not match.'
        });
        return; // Stop form submission
    }

    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)/; // Must contain letters and numbers
    if (!passwordPattern.test(userData.password)) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Password',
            text: 'Password must contain both letters and numbers.'
        });
        return; // Stop form submission
    }

    try {
        const response = await fetch('http://127.0.0.1:4000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        console.log('Success:', data);
        await Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'You have registered successfully.'
        });

        // Clear fields only on success
        form.reset();

    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred during registration.'
        });

        // Optionally, clear the fields here as well
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('confpassword').value = '';
    }
});
