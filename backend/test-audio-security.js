const http = require('http');

const PORT = 5058;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to make requests
const makeRequest = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
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
    });

    req.on('error', (err) => reject(err));
    if (data) {
      req.write(data);
    }
    req.end();
  });
};

const registerUser = async (email, username, password) => {
  const res = await makeRequest('POST', '/api/auth/register', { email, username, password });
  return res.body.token;
};

const loginUser = async (email, password) => {
  const res = await makeRequest('POST', '/api/auth/login', { email, password });
  return res.body.token;
};

async function run() {
  console.log('Starting Beat IP Protection Integration Tests...');

  // Setup: Register and Login Users
  console.log('\n--- Registering and Logging in Users ---');
  const tokenOwner = await registerUser('owner@mail.com', 'beatowner', 'password123');
  const tokenEditor = await registerUser('editor@mail.com', 'beateditor', 'password123');
  const tokenViewer = await registerUser('viewer@mail.com', 'beatviewer', 'password123');
  const tokenStranger = await registerUser('stranger@mail.com', 'stranger', 'password123');

  // Verify tokens
  if (!tokenOwner || !tokenEditor || !tokenViewer || !tokenStranger) {
    throw new Error('User setup failed (token missing)');
  }
  console.log('Users setup: PASS');

  // Owner creates a project
  console.log('\n--- Project Owner (User A) creates Project ---');
  const projectRes = await makeRequest('POST', '/api/projects', {
    title: 'Top Secret Beat',
    description: 'Fresh lofi beats',
    genre: 'Lofi'
  }, { Authorization: `Bearer ${tokenOwner}` });

  if (projectRes.statusCode !== 201) {
    throw new Error(`Failed to create project: ${JSON.stringify(projectRes.body)}`);
  }
  const projectId = projectRes.body.id;
  console.log(`Project created with ID: ${projectId}. PASS`);

  // Owner invites Editor (User B) and Viewer (User C)
  console.log('\n--- Project Owner invites Editor and Viewer ---');
  
  // Resolve User IDs for Editor & Viewer (we can decode or just search users)
  // Let's search users to find their IDs
  const searchRes = await makeRequest('GET', '/api/search/users?q=beat', null, { Authorization: `Bearer ${tokenOwner}` });
  const editorUser = searchRes.body.find(u => u.username === 'beateditor');
  const viewerUser = searchRes.body.find(u => u.username === 'beatviewer');

  if (!editorUser || !viewerUser) {
    throw new Error('Failed to find users in search results');
  }

  // Invite Editor
  const inviteEditorRes = await makeRequest('POST', '/api/collaboration/invite', {
    projectId,
    userId: editorUser.id,
    role: 'editor'
  }, { Authorization: `Bearer ${tokenOwner}` });

  if (inviteEditorRes.statusCode !== 201) {
    throw new Error(`Failed to invite editor: ${JSON.stringify(inviteEditorRes.body)}`);
  }
  const editorCollabId = inviteEditorRes.body.id;

  // Invite Viewer
  const inviteViewerRes = await makeRequest('POST', '/api/collaboration/invite', {
    projectId,
    userId: viewerUser.id,
    role: 'viewer'
  }, { Authorization: `Bearer ${tokenOwner}` });

  if (inviteViewerRes.statusCode !== 201) {
    throw new Error(`Failed to invite viewer: ${JSON.stringify(inviteViewerRes.body)}`);
  }
  const viewerCollabId = inviteViewerRes.body.id;

  console.log('Collaborators invited successfully. PASS');

  // Accept invitations
  console.log('\n--- Editor and Viewer accept invitations ---');
  const acceptEditor = await makeRequest('POST', '/api/collaboration/accept', { collabId: editorCollabId }, { Authorization: `Bearer ${tokenEditor}` });
  if (acceptEditor.statusCode !== 200) {
    throw new Error(`Editor failed to accept: ${JSON.stringify(acceptEditor.body)}`);
  }

  const acceptViewer = await makeRequest('POST', '/api/collaboration/accept', { collabId: viewerCollabId }, { Authorization: `Bearer ${tokenViewer}` });
  if (acceptViewer.statusCode !== 200) {
    throw new Error(`Viewer failed to accept: ${JSON.stringify(acceptViewer.body)}`);
  }
  console.log('Invitations accepted. PASS');

  // ============================================
  // Test Case 1: Upload Beats Authorization
  // ============================================
  console.log('\n--- Test 1.1: Owner uploads beat ---');
  const uploadOwner = await makeRequest('POST', `/api/projects/${projectId}/audio/upload`, {
    filename: 'master_beat.wav',
    url: 'https://storage.provider.com/beats/master_beat.wav',
    mimetype: 'audio/wav',
    size: 50 * 1024 * 1024
  }, { Authorization: `Bearer ${tokenOwner}` });
  console.log('Owner upload status:', uploadOwner.statusCode);
  if (uploadOwner.statusCode !== 201) {
    throw new Error('Expected owner upload to succeed');
  }
  const audioId = uploadOwner.body.id;

  console.log('\n--- Test 1.2: Editor uploads stem ---');
  const uploadEditor = await makeRequest('POST', `/api/projects/${projectId}/audio/upload`, {
    filename: 'editor_drums.wav',
    url: 'https://storage.provider.com/beats/editor_drums.wav',
    mimetype: 'audio/wav',
    size: 20 * 1024 * 1024
  }, { Authorization: `Bearer ${tokenEditor}` });
  console.log('Editor upload status:', uploadEditor.statusCode);
  if (uploadEditor.statusCode !== 201) {
    throw new Error('Expected editor upload to succeed');
  }

  console.log('\n--- Test 1.3: Viewer attempts to upload audio (Blocked) ---');
  const uploadViewer = await makeRequest('POST', `/api/projects/${projectId}/audio/upload`, {
    filename: 'viewer_theft.wav',
    url: 'https://storage.provider.com/beats/viewer_theft.wav',
    mimetype: 'audio/wav',
    size: 10 * 1024 * 1024
  }, { Authorization: `Bearer ${tokenViewer}` });
  console.log('Viewer upload status:', uploadViewer.statusCode);
  console.log('Viewer upload body:', uploadViewer.body);
  if (uploadViewer.statusCode !== 403) {
    throw new Error(`Expected 403 Forbidden for viewer upload, got ${uploadViewer.statusCode}`);
  }

  console.log('\n--- Test 1.4: Stranger attempts to upload audio (Blocked) ---');
  const uploadStranger = await makeRequest('POST', `/api/projects/${projectId}/audio/upload`, {
    filename: 'stranger_theft.wav',
    url: 'https://storage.provider.com/beats/stranger_theft.wav',
    mimetype: 'audio/wav',
    size: 10 * 1024 * 1024
  }, { Authorization: `Bearer ${tokenStranger}` });
  console.log('Stranger upload status:', uploadStranger.statusCode);
  if (uploadStranger.statusCode !== 403) {
    throw new Error(`Expected 403 Forbidden for stranger upload, got ${uploadStranger.statusCode}`);
  }
  console.log('Upload tests passed. PASS');

  // ============================================
  // Test Case 2: List Audio Metadata
  // ============================================
  console.log('\n--- Test 2.1: Viewer list project audio ---');
  const listViewer = await makeRequest('GET', `/api/projects/${projectId}/audio`, null, { Authorization: `Bearer ${tokenViewer}` });
  console.log('Viewer list status:', listViewer.statusCode);
  if (listViewer.statusCode !== 200 || listViewer.body.length !== 2) {
    throw new Error(`Expected viewer to list 2 tracks, got ${listViewer.statusCode}`);
  }

  console.log('\n--- Test 2.2: Stranger attempts to list project audio (Blocked) ---');
  const listStranger = await makeRequest('GET', `/api/projects/${projectId}/audio`, null, { Authorization: `Bearer ${tokenStranger}` });
  console.log('Stranger list status:', listStranger.statusCode);
  if (listStranger.statusCode !== 403) {
    throw new Error(`Expected 403 Forbidden for stranger listing, got ${listStranger.statusCode}`);
  }
  console.log('Listing tests passed. PASS');

  // ============================================
  // Test Case 3: Stream and Watermark verification
  // ============================================
  console.log('\n--- Test 3.1: Owner streams original beat ---');
  const streamOwner = await makeRequest('GET', `/api/projects/${projectId}/audio/stream/${audioId}`, null, { Authorization: `Bearer ${tokenOwner}` });
  console.log('Owner stream details:', streamOwner.body);
  if (streamOwner.statusCode !== 200 || streamOwner.body.watermarked !== false || streamOwner.body.quality !== 'high-fidelity') {
    throw new Error('Owner should receive high-fidelity raw audio stream metadata');
  }

  console.log('\n--- Test 3.2: Editor streams original beat ---');
  const streamEditor = await makeRequest('GET', `/api/projects/${projectId}/audio/stream/${audioId}`, null, { Authorization: `Bearer ${tokenEditor}` });
  console.log('Editor stream details:', streamEditor.body);
  if (streamEditor.statusCode !== 200 || streamEditor.body.watermarked !== false || streamEditor.body.quality !== 'high-fidelity') {
    throw new Error('Editor should receive high-fidelity raw audio stream metadata');
  }

  console.log('\n--- Test 3.3: Viewer streams original beat (Watermark enforced) ---');
  const streamViewer = await makeRequest('GET', `/api/projects/${projectId}/audio/stream/${audioId}`, null, { Authorization: `Bearer ${tokenViewer}` });
  console.log('Viewer stream details:', streamViewer.body);
  if (streamViewer.statusCode !== 200 || streamViewer.body.watermarked !== true || streamViewer.body.quality !== '128kbps-watermarked') {
    throw new Error('Viewer must receive compressed watermarked stream metadata to protect IP');
  }
  console.log('Streaming / Watermarking tests passed. PASS');

  // ============================================
  // Test Case 4: Download restrictions verification
  // ============================================
  console.log('\n--- Test 4.1: Owner downloads original beat ---');
  const downloadOwner = await makeRequest('GET', `/api/projects/${projectId}/audio/download/${audioId}`, null, { Authorization: `Bearer ${tokenOwner}` });
  console.log('Owner download details:', downloadOwner.body);
  if (downloadOwner.statusCode !== 200 || !downloadOwner.body.downloadUrl) {
    throw new Error('Owner should be allowed to download raw beat');
  }

  console.log('\n--- Test 4.2: Editor downloads original beat ---');
  const downloadEditor = await makeRequest('GET', `/api/projects/${projectId}/audio/download/${audioId}`, null, { Authorization: `Bearer ${tokenEditor}` });
  console.log('Editor download details:', downloadEditor.body);
  if (downloadEditor.statusCode !== 200 || !downloadEditor.body.downloadUrl) {
    throw new Error('Editor should be allowed to download raw beat');
  }

  console.log('\n--- Test 4.3: Viewer attempts to download original beat (Blocked) ---');
  const downloadViewer = await makeRequest('GET', `/api/projects/${projectId}/audio/download/${audioId}`, null, { Authorization: `Bearer ${tokenViewer}` });
  console.log('Viewer download status:', downloadViewer.statusCode);
  console.log('Viewer download body:', downloadViewer.body);
  if (downloadViewer.statusCode !== 403 || !downloadViewer.body.error.includes('Download disabled')) {
    throw new Error(`Expected 403 Forbidden with Download disabled message for viewer, got ${downloadViewer.statusCode}`);
  }
  console.log('Download locks tests passed. PASS');

  console.log('\nAll Beat IP Protection and RBAC tests passed successfully! 🛡️🎵✨');
}

run().catch((err) => {
  console.error('\nFAIL: Beat IP Protection Test failed with error:', err.message);
  process.exit(1);
});
