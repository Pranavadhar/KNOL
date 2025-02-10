document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const submitButton = this.querySelector('button[type="submit"]');

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        formMessage.textContent = '';

        // Collect form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Log the data being sent (for debugging)
        console.log('Form data being sent:', { name, email, message });

        // Construct the request body
        const requestBody = new URLSearchParams({ name, email, message });

        // Correct Render app URL
        const response = await fetch('https://konl.onrender.com/api/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestBody.toString()
        });

        if (response.ok) {
            formMessage.textContent = 'Thank you for your submission! We will get back to you soon.';
            formMessage.style.color = 'green';
            this.reset();
        } else {
            const errorText = await response.text();
            formMessage.textContent = `Error: ${errorText}`;
            formMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = 'Something went wrong. Please try again later.';
        formMessage.style.color = 'red';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
});
