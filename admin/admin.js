document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://nameless-stream-52860-0d2bd30c49a5.herokuapp.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    const token = data.token;

    // Store token temporarily for the session
    sessionStorage.setItem('token', token);  // Use sessionStorage instead of localStorage

    // Redirect to adminPanel after successful login
    window.location.href = '/adminPanel';  // Redirect to admin panel page
  } catch (error) {
    alert(error.message);
  }
});
