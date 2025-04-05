document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem('authToken');  // Get token from sessionStorage
    if (!token) {
        window.location.href = '/login';  // If no token, redirect to login page
    }

    // Debugging: Check if token is retrieved properly
    console.log("Token from sessionStorage:", token);

    // Send the token to the server as an Authorization header for protected routes
    fetch('/admin', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  // Pass token in the Authorization header
        }
    }).then(response => {
        console.log("Response status:", response.status);
        if (response.status === 200) {
            // Continue with your admin page logic here
            console.log("Successfully authenticated");
        } else {
            window.location.href = '/login';  // If unauthorized, redirect to login
        }
    }).catch(error => {
        console.error("Error fetching admin page:", error);
        window.location.href = '/login';  // If error, redirect to login
    });

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem('authToken');  // Remove token from sessionStorage
        window.location.href = '/login';  // Redirect to login page
    });
});

