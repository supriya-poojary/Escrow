const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const errorMsg = document.getElementById('errorMsg');

const API_URL = 'http://localhost:3000/api';

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) return;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('aether_user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            showError(data.message || 'Login failed');
        }
    } catch (err) {
        showError('Server error. Please try again.');
        console.error(err);
    }
});

function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.classList.remove('hidden');
}
