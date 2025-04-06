document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is authenticated (session check)
    fetch('/admin', {
        method: 'GET',
        credentials: 'same-origin',  // Send cookies (session ID) with the request
    })
    .then(response => {
        if (response.status === 200) {
            console.log("Successfully authenticated");
        } else {
            window.location.href = '/prihlasenie';  // If unauthorized, redirect to login
        }
    })
    .catch(error => {
        console.error("Error fetching admin page:", error);
        window.location.href = '/prihlasenie';  // If error, redirect to login
    });

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
        fetch('/logout', { method: 'POST' })  // Log out the user (destroy session)
            .then(() => {
                window.location.href = '/prihlasenie';  // Redirect to login page
            });
    });
});
