document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('https://nameless-stream-52860-0d2bd30c49a5.herokuapp.com/login', {  
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/adminPanel.html';
  } else {
      alert('Login failed');
  }
});
