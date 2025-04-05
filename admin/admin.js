// admin.js
document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem('authToken');  // Get token from sessionStorage
    if (!token) {
        window.location.href = '/login';  // If no token, redirect to login page
    }

    // Send the token to the server as an Authorization header for protected routes
    fetch('/admin', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  // Pass token in the Authorization header
        }
    }).then(response => {
        if (response.status === 200) {
            // You can handle further logic here
        } else {
            window.location.href = '/login';  // If unauthorized, redirect to login
        }
    });

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem('authToken');  // Remove token from sessionStorage
        window.location.href = '/login';  // Redirect to login page
    });
});
