const http = require('http');

const PORT = 5057;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to make POST requests
const postRequest = (path, body, headers = {}) => {
  return new Promise((resolve, reject) => {
    const data = typeof body === 'string' ? body : JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
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

async function run() {
  console.log('Starting Security Layer Integration Tests...');

  // 1. Input Validation Tests
  console.log('\n--- Test 1: Register validation (invalid email) ---');
  const resVal1 = await postRequest('/api/auth/register', {
    email: 'not-an-email',
    username: 'validuser',
    password: 'password123'
  });
  console.log('Status code:', resVal1.statusCode);
  console.log('Response body:', resVal1.body);
  if (resVal1.statusCode !== 400 || !resVal1.body.error.includes('Invalid email')) {
    throw new Error('Expected 400 Bad Request with invalid email error message');
  }
  console.log('PASS');

  console.log('\n--- Test 2: Register validation (short username) ---');
  const resVal2 = await postRequest('/api/auth/register', {
    email: 'valid@mail.com',
    username: 'yo',
    password: 'password123'
  });
  console.log('Status code:', resVal2.statusCode);
  console.log('Response body:', resVal2.body);
  if (resVal2.statusCode !== 400 || !resVal2.body.error.includes('Username must be at least 3 characters')) {
    throw new Error('Expected 400 Bad Request with short username error message');
  }
  console.log('PASS');

  // 2. Payload Size Limit Test
  console.log('\n--- Test 3: Large payload attack prevention (>10kb) ---');
  const largeData = 'x'.repeat(12 * 1024); // 12 KB
  const resVal3 = await postRequest('/api/auth/register', {
    email: 'valid@mail.com',
    username: 'validuser',
    password: 'password123',
    attack: largeData
  });
  console.log('Status code:', resVal3.statusCode);
  // Express body-parser returns 413 Payload Too Large
  if (resVal3.statusCode !== 413) {
    throw new Error(`Expected 413 Payload Too Large, got ${resVal3.statusCode}`);
  }
  console.log('PASS');

  // 3. Auth Rate Limiting Test
  console.log('\n--- Test 4: Auth Rate Limiting (max 10 attempts) ---');
  let rateLimited = false;
  // Send 12 requests in rapid succession to trigger the limit of 10
  for (let i = 1; i <= 12; i++) {
    const res = await postRequest('/api/auth/login', {
      email: 'someuser@mail.com',
      password: 'wrongpassword'
    });
    console.log(`Attempt ${i}: Status code = ${res.statusCode}`);
    if (res.statusCode === 429) {
      rateLimited = true;
      console.log('Response body:', res.body);
      if (res.body.error !== "Too many login attempts. Try again later.") {
        throw new Error(`Unexpected rate limit message: ${res.body.error}`);
      }
      break;
    }
  }
  if (!rateLimited) {
    throw new Error('Expected rate limiting (429) after 10 requests, but got none');
  }
  console.log('PASS');

  console.log('\nAll Security Integration Tests passed successfully! 🛡️✨');
}

run().catch((err) => {
  console.error('\nFAIL: Security Test failed with error:', err.message);
  process.exit(1);
});
