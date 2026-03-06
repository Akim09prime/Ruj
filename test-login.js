
const fetch = require('node-fetch');

async function testLogin() {
    const loginUrl = 'http://localhost:3000/api/auth.php?action=login';
    const sessionUrl = 'http://localhost:3000/api/auth.php?action=session';

    console.log('Testing login...');
    const loginRes = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'carvello2024' })
    });

    if (loginRes.status !== 200) {
        console.error('Login failed with status:', loginRes.status);
        const text = await loginRes.text();
        console.error('Response:', text);
        return;
    }

    const cookies = loginRes.headers.get('set-cookie');
    console.log('Login successful. Cookies:', cookies);

    if (!cookies) {
        console.error('No cookies received!');
        return;
    }

    console.log('Testing session check...');
    const sessionRes = await fetch(sessionUrl, {
        headers: { 'Cookie': cookies }
    });

    if (sessionRes.status !== 200) {
        console.error('Session check failed with status:', sessionRes.status);
        return;
    }

    const sessionData = await sessionRes.json();
    console.log('Session data:', sessionData);

    if (sessionData.authenticated) {
        console.log('TEST PASSED: Authenticated successfully.');
    } else {
        console.error('TEST FAILED: Not authenticated.');
    }
}

testLogin().catch(console.error);
