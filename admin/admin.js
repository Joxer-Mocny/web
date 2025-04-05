document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login';  // If no token, redirect to login
    }

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem('authToken'); // Remove token from sessionStorage
        window.location.href = '/login';  // Redirect to login page
    });
});