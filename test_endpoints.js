// test_endpoints.js
// Tests backend endpoints after the database import and route updates. Uses native global fetch in Node v22.

async function test() {
  console.log('--- TEST LOGIN ---');
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ecole.cm', motDePasse: 'root' })
  });
  const loginData = await loginRes.json();
  console.log('Login Result:', loginData.success ? 'SUCCESS' : 'FAILED');
  if (!loginData.success) {
    console.error(loginData);
    return;
  }
  const token = loginData.token;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  console.log('\n--- TEST GET CLASSES ---');
  const classesRes = await fetch('http://localhost:3001/api/classes', { headers });
  const classes = await classesRes.json();
  console.log(`Classes Loaded: ${classes.length} classes found.`);
  console.log('First class:', classes[0]);

  console.log('\n--- TEST GET STUDENTS ---');
  const studentsRes = await fetch('http://localhost:3001/api/students', { headers });
  const studentsData = await studentsRes.json();
  const students = studentsData.data || studentsData;
  console.log(`Students Loaded: ${students.length} students found.`);
  console.log('First student:', students[0]);

  console.log('\n--- TEST GET USERS ---');
  const usersRes = await fetch('http://localhost:3001/api/users', { headers });
  const users = await usersRes.json();
  console.log(`Users Loaded: ${users.length} users found.`);
  console.log('First user:', users[0]);
}

test().catch(console.error);
