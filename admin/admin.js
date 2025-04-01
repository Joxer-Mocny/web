// Handles admin login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent default form behavior

  // Get input values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Send login request to backend
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  // If login is successful, store token and redirect
  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('adminToken', data.token);
    window.location.href = 'adminPanel.html';
  } else {
    alert('Login failed'); // Show error if login fails
  }
});
