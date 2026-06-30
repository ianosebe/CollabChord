const { io } = require('socket.io-client');
const http = require('http');

const PORT = 5055;
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
  console.log('Starting Real-Time Socket.io Integration Tests...');

  // 1. Register User A
  console.log('\n--- Registering User A ---');
  const regRes = await postRequest('/api/auth/register', {
    email: 'chatter1@mail.com',
    username: 'chatter1',
    password: 'password123'
  });
  console.log('Register status:', regRes.statusCode);
  const token = regRes.body.token;
  const user = regRes.body.user;
  
  if (!token) {
    throw new Error('Failed to obtain authentication token');
  }

  // Register User B
  console.log('\n--- Registering User B ---');
  const regResB = await postRequest('/api/auth/register', {
    email: 'chatter2@mail.com',
    username: 'chatter2',
    password: 'password123'
  });
  console.log('Register B status:', regResB.statusCode);
  const tokenB = regResB.body.token;
  const userB = regResB.body.user;
  
  if (!tokenB) {
    throw new Error('Failed to obtain User B authentication token');
  }

  // 2. Create Project
  console.log('\n--- Creating Project ---');
  const projRes = await postRequest('/api/projects', {
    title: 'Chat Test Project',
    description: 'Project room for socket testing',
    genre: 'Lo-Fi'
  }, {
    'Authorization': `Bearer ${token}`
  });
  console.log('Project status:', projRes.statusCode);
  const project = projRes.body;
  const projectId = project.id;
  console.log('Project ID:', projectId);

  if (!projectId) {
    throw new Error('Failed to create project');
  }

  // Invite User B as collaborator
  console.log('\n--- Inviting User B ---');
  const inviteRes = await postRequest('/api/collaboration/invite', {
    projectId,
    userId: userB.id
  }, {
    'Authorization': `Bearer ${token}`
  });
  console.log('Invite status:', inviteRes.statusCode);
  const collabId = inviteRes.body.id;

  // Accept Invite as User B
  console.log('\n--- Accepting Invite as User B ---');
  const acceptRes = await postRequest('/api/collaboration/accept', {
    collabId
  }, {
    'Authorization': `Bearer ${tokenB}`
  });
  console.log('Accept status:', acceptRes.statusCode);

  // 3. Connect Socket.io Clients
  console.log('\n--- Connecting Socket.io Clients ---');
  const clientA = io(BASE_URL, {
    auth: {
      token: token
    }
  });
  const clientB = io(BASE_URL, {
    auth: {
      token: tokenB
    }
  });

  await Promise.all([
    new Promise((resolve) => clientA.on('connect', resolve)),
    new Promise((resolve) => clientB.on('connect', resolve))
  ]);

  console.log('Client A and Client B connected to WebSocket server!');

  // 4. Join Project Room
  console.log('\n--- Joining Project Room ---');
  clientA.emit('join_project', projectId);
  clientB.emit('join_project', projectId);

  // Give some time for rooms to register
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 5. Test message transmission and persistence
  console.log('\n--- Testing send_message / receive_message ---');
  const testMessage = "Let's lay down a solid bassline first.";
  
  const receivePromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for receive_message event'));
    }, 3000);

    clientB.on('receive_message', (data) => {
      clearTimeout(timeout);
      console.log('Client B received message:', data);
      if (data.message === testMessage && data.user.username === 'chatter1') {
        resolve(data);
      } else {
        reject(new Error('Received incorrect message payload'));
      }
    });
  });

  clientA.emit('send_message', {
    projectId,
    message: testMessage
  });

  const receivedData = await receivePromise;
  console.log('Message E2E verification: PASS');

  // 6. Test typing indicator
  console.log('\n--- Testing typing indicator ---');
  const typingPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for typing event'));
    }, 3000);

    clientB.on('typing', (data) => {
      clearTimeout(timeout);
      console.log('Client B received typing event:', data);
      if (data.user === 'chatter1') {
        resolve();
      } else {
        reject(new Error('Received incorrect typing user'));
      }
    });
  });

  clientA.emit('typing', {
    projectId
  });

  await typingPromise;
  console.log('Typing indicator E2E verification: PASS');

  // 7. Verify Chat History HTTP retrieval
  console.log('\n--- Verifying Chat History via HTTP ---');
  // Wait a small delay to ensure DB transaction finishes
  await new Promise((resolve) => setTimeout(resolve, 500));

  const historyRes = await getRequest(`/api/chat/${projectId}`, {
    'Authorization': `Bearer ${token}`
  });
  console.log('GET /api/chat/:projectId response:', historyRes.body);
  
  if (historyRes.statusCode !== 200) {
    throw new Error(`Failed to query history API. Status: ${historyRes.statusCode}`);
  }

  const messages = historyRes.body;
  if (messages.length > 0 && messages[0].content === testMessage) {
    console.log('Chat history verification: PASS');
  } else {
    throw new Error('Message not persisted in database history');
  }

  // 8. Clean up
  console.log('\n--- Cleaning up Sockets ---');
  clientA.disconnect();
  clientB.disconnect();

  console.log('\nAll Socket.io tests passed successfully! 🌟');
}

run().catch((err) => {
  console.error('\nFAIL: Socket.io Integration Test failed with error:', err.message);
  process.exit(1);
});
