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

        console.log("Login response status:", response.status);  // Debug log

        if (response.ok) {
            window.location.href = '/admin'; // Redirect to admin page
        } else {
            alert('Login failed');
        }
    });
});
