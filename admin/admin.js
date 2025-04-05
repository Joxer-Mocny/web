document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem('authToken');  // Get token from sessionStorage
    if (!token) {
        window.location.href = '/login';  // If no token, redirect to login page
    }

    // Debugging: Log the token to ensure it's being retrieved correctly
    console.log("Token from sessionStorage:", token);

    // Send the token to the server as an Authorization header for the protected route
    fetch('/admin', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Attach the token in the Authorization header
            'Content-Type': 'application/json'  // Ensure the content type is set correctly
        }
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (response.status === 200) {
            // Admin page logic
            console.log("Successfully authenticated");
        } else {
            window.location.href = '/login';  // If unauthorized, redirect to login
        }
    })
    .catch(error => {
        console.error("Error fetching admin page:", error);
        window.location.href = '/login';  // If error, redirect to login
    });

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem('authToken');  // Remove token from sessionStorage
        window.location.href = '/login';  // Redirect to login page
    });
});
