document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Send login request to the server
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('authToken', data.token); // Store token in sessionStorage
            window.location.href = '/admin'; // Redirect to admin page
        } else {
            alert('Login failed');
        }
    });
});
