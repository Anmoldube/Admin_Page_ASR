// Test script for login endpoints
async function testSeed() {
    console.log('Testing seed endpoint...');
    try {
        const res = await fetch('http://localhost:3000/api/init/seed');
        const data = await res.json();
        console.log('Seed response:', data);
        return data;
    } catch (err) {
        console.error('Seed error:', err);
    }
}

async function testAdminLogin() {
    console.log('\nTesting admin login...');
    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@gmail.com',
                password: 'admin@123'
            })
        });
        const data = await res.json();
        console.log('Admin login response:', data);
        return data;
    } catch (err) {
        console.error('Admin login error:', err);
    }
}

async function testClientRegister() {
    console.log('\nTesting client registration...');
    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'client@test.com',
                password: 'password123',
                name: 'Test Client',
                phone: '+1 (555) 999-8888',
                role: 'client'
            })
        });
        const data = await res.json();
        console.log('Client registration response:', data);
        return data;
    } catch (err) {
        console.error('Client register error:', err);
    }
}

async function testClientLogin() {
    console.log('\nTesting client login...');
    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'client@test.com',
                password: 'password123'
            })
        });
        const data = await res.json();
        console.log('Client login response:', data);
        return data;
    } catch (err) {
        console.error('Client login error:', err);
    }
}

async function runAllTests() {
    await testSeed();
    await testAdminLogin();
    await testClientRegister();
    await testClientLogin();
}

runAllTests();
