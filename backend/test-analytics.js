const { io } = require('socket.io-client');
const http = require('http');

const PORT = 5056;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to make POST requests using native http module
const postRequest = (path, body, headers = {}) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          ...headers
        }
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              body: JSON.parse(responseBody)
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              body: responseBody
            });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
};

// Helper to make GET requests using native http module
const getRequest = (path, headers = {}) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path: path,
        method: 'GET',
        headers: headers
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              body: JSON.parse(responseBody)
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              body: responseBody
            });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.end();
  });
};

async function run() {
  console.log('Starting Analytics System Integration Tests...');

  // 1. Register User
  console.log('\n--- Registering User ---');
  const email = `analytics_user_${Date.now()}@mail.com`;
  const username = `analytics_user_${Date.now()}`;
  const regRes = await postRequest('/api/auth/register', {
    email,
    username,
    password: 'password123'
  });
  console.log('Register status:', regRes.statusCode);
  if (regRes.statusCode !== 201) {
    throw new Error('Registration failed');
  }

  // 2. Login User (this tracks 'login' event)
  console.log('\n--- Logging in User (tracks login event) ---');
  const loginRes = await postRequest('/api/auth/login', {
    email,
    password: 'password123'
  });
  console.log('Login status:', loginRes.statusCode);
  const token = loginRes.body.token;
  const user = loginRes.body.user;
  if (!token) {
    throw new Error('Login failed to return token');
  }

  // 3. Verify initial user stats (should be all 0)
  console.log('\n--- Getting initial User Stats (me) ---');
  const initialMeRes = await getRequest('/api/analytics/me', {
    'Authorization': `Bearer ${token}`
  });
  console.log('Initial stats:', initialMeRes.body);
  if (initialMeRes.statusCode !== 200) {
    throw new Error('Failed to get user stats');
  }
  if (initialMeRes.body.projects !== 0 || initialMeRes.body.messages !== 0) {
    throw new Error('Initial stats should be 0');
  }

  // 4. Create Project (tracks project_created event)
  console.log('\n--- Creating Project (tracks project_created) ---');
  const projRes = await postRequest('/api/projects', {
    title: 'Analytics Test Project',
    description: 'Verifying stats tracking',
    genre: 'Synthwave'
  }, {
    'Authorization': `Bearer ${token}`
  });
  console.log('Project creation status:', projRes.statusCode);
  const projectId = projRes.body.id;
  if (!projectId) {
    throw new Error('Project creation failed');
  }

  // 5. Verify stats updated for user (should have 1 project)
  console.log('\n--- Getting updated User Stats (me) ---');
  const updatedMeRes = await getRequest('/api/analytics/me', {
    'Authorization': `Bearer ${token}`
  });
  console.log('Updated stats:', updatedMeRes.body);
  if (updatedMeRes.body.projects !== 1) {
    throw new Error('User project count should be 1');
  }

  // 6. Connect Socket and send message (tracks message_sent event)
  console.log('\n--- Connecting Socket and sending message (tracks message_sent) ---');
  const client = io(BASE_URL, {
    auth: {
      token: token
    }
  });
  await new Promise((resolve) => client.on('connect', resolve));
  console.log('Socket client connected!');

  client.emit('join_project', projectId);
  await new Promise((resolve) => setTimeout(resolve, 200));

  client.emit('send_message', {
    projectId,
    message: 'Hello analytics database!'
  });

  // Wait a small delay to ensure DB transaction finishes
  await new Promise((resolve) => setTimeout(resolve, 800));
  client.disconnect();

  // 7. Verify stats updated for user (should have 1 message)
  console.log('\n--- Getting final User Stats (me) ---');
  const finalMeRes = await getRequest('/api/analytics/me', {
    'Authorization': `Bearer ${token}`
  });
  console.log('Final stats:', finalMeRes.body);
  if (finalMeRes.body.messages !== 1) {
    throw new Error('User message count should be 1');
  }

  // 8. Verify Platform Stats
  console.log('\n--- Getting Platform Stats ---');
  const platformRes = await getRequest('/api/analytics/platform');
  console.log('Platform stats:', platformRes.body);
  if (platformRes.statusCode !== 200) {
    throw new Error('Failed to get platform stats');
  }
  if (platformRes.body.totalUsers <= 0 || platformRes.body.totalProjects <= 0 || platformRes.body.totalMessages <= 0) {
    throw new Error('Platform stats should reflect positive values');
  }

  console.log('\nAll Analytics Integration Tests passed successfully! 📈✨');
}

run().catch((err) => {
  console.error('\nFAIL: Analytics Test failed with error:', err.message);
  process.exit(1);
});
