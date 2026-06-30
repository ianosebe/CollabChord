#!/bin/bash
set -e

# Start the server in the background on a custom port
PORT=5055 node src/server.js > server.log 2>&1 &
SERVER_PID=$!

# Ensure cleanup on exit
cleanup() {
  echo "Cleaning up server process $SERVER_PID..."
  kill $SERVER_PID || true
}
trap cleanup EXIT

# Wait for server to boot
echo "Waiting for server to start on port 5055..."
sleep 5

# Check if server is running
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "Server failed to start. Logs:"
  cat server.log
  exit 1
fi

echo "Server started successfully!"

# ==========================================
# MODULE 1: AUTHENTICATION TESTS
# ==========================================

# 1. Test registration validation (short password)
echo -e "\n--- Test 1: Register validation (short password) ---"
curl -s -X POST http://localhost:5055/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com", "username":"testuser", "password":"123"}' \
  | grep -q "Password must be at least 6 characters long" && echo "PASS" || (echo "FAIL"; exit 1)

# 2. Test registration (successful - User A)
echo -e "\n--- Test 2: Register successful User A ---"
REGISTER_RESP=$(curl -s -X POST http://localhost:5055/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com", "username":"testuser", "password":"password123"}')

echo "$REGISTER_RESP"
TOKEN_A=$(echo "$REGISTER_RESP" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
USER_A_ID=$(echo "$REGISTER_RESP" | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
if [ -z "$TOKEN_A" ]; then
  echo "Failed to get token from registration response!"
  exit 1
fi
echo "Registration User A PASS. Token obtained. User ID is $USER_A_ID"

# 3. Test registration duplicate
echo -e "\n--- Test 3: Register duplicate User A ---"
curl -s -X POST http://localhost:5055/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com", "username":"testuser", "password":"password123"}' \
  | grep -q "User already exists" && echo "PASS" || (echo "FAIL"; exit 1)

# 4. Register successful User B
echo -e "\n--- Test 4: Register successful User B ---"
REGISTER_B_RESP=$(curl -s -X POST http://localhost:5055/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"collab@mail.com", "username":"collabuser", "password":"password123"}')

echo "$REGISTER_B_RESP"
TOKEN_B=$(echo "$REGISTER_B_RESP" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
USER_B_ID=$(echo "$REGISTER_B_RESP" | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
if [ -z "$TOKEN_B" ]; then
  echo "Failed to get token for User B!"
  exit 1
fi
echo "Registration User B PASS. Token obtained. User ID is $USER_B_ID"

# 5. Test login (successful)
echo -e "\n--- Test 5: Login with correct credentials (User A) ---"
LOGIN_RESP=$(curl -s -X POST http://localhost:5055/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com", "password":"password123"}')

echo "$LOGIN_RESP"
LOGIN_TOKEN=$(echo "$LOGIN_RESP" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
if [ -z "$LOGIN_TOKEN" ]; then
  echo "Failed to get token from login response!"
  exit 1
fi
echo "Login PASS."

# ==========================================
# MODULE 2: USER PROFILE TESTS
# ==========================================

# 6. Test GET /api/users/me (valid token)
echo -e "\n--- Test 6: GET /api/users/me with valid token ---"
ME_RESP=$(curl -s -X GET http://localhost:5055/api/users/me \
  -H "Authorization: Bearer $TOKEN_A")
echo "$ME_RESP"
echo "$ME_RESP" | grep -q "testuser" && echo "PASS" || (echo "FAIL"; exit 1)

# 7. Test PUT /api/users/me (update profile)
echo -e "\n--- Test 7: PUT /api/users/me (update profile) ---"
UPDATE_RESP=$(curl -s -X PUT http://localhost:5055/api/users/me \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"username":"newtestname", "bio":"synth programmer & producer", "avatar":"https://example.com/synth.png"}')
echo "$UPDATE_RESP"
echo "$UPDATE_RESP" | grep -q "newtestname" && echo "$UPDATE_RESP" | grep -q "synth programmer" && echo "PASS" || (echo "FAIL"; exit 1)

# ==========================================
# MODULE 3: PROJECTS CORE SYSTEM TESTS
# ==========================================

# 8. Test POST /api/projects (successful creation)
echo -e "\n--- Test 8: POST /api/projects with valid token ---"
PROJECT_RESP=$(curl -s -X POST http://localhost:5055/api/projects \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title":"First Synth Track", "description":"Analog modular synth patch", "genre":"Ambient"}')
echo "$PROJECT_RESP"
PROJECT_ID=$(echo "$PROJECT_RESP" | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
if [ -z "$PROJECT_ID" ]; then
  echo "Failed to get project ID from creation response!"
  exit 1
fi
echo "Project creation PASS. Project ID is $PROJECT_ID"

# ==========================================
# MODULE 4: COLLABORATION SYSTEM TESTS
# ==========================================

# 9. Test POST /api/collaboration/invite (no token)
echo -e "\n--- Test 9: POST /api/collaboration/invite without token ---"
curl -s -X POST http://localhost:5055/api/collaboration/invite \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\", \"userId\":\"$USER_B_ID\"}" \
  | grep -q "Unauthorized" && echo "PASS" || (echo "FAIL"; exit 1)

# 10. Test POST /api/collaboration/invite (successful invite)
echo -e "\n--- Test 10: POST /api/collaboration/invite with valid token ---"
INVITE_RESP=$(curl -s -X POST http://localhost:5055/api/collaboration/invite \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\", \"userId\":\"$USER_B_ID\"}")
echo "$INVITE_RESP"
COLLAB_ID=$(echo "$INVITE_RESP" | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
if [ -z "$COLLAB_ID" ]; then
  echo "Failed to get collaboration ID from invite response!"
  exit 1
fi
echo "Invite creation PASS. Collab ID is $COLLAB_ID"

# 11. Test GET /api/collaboration/project/:id (verify not accepted yet)
echo -e "\n--- Test 11: GET collaborators before accept ---"
COLLABS_RESP=$(curl -s -X GET http://localhost:5055/api/collaboration/project/$PROJECT_ID)
echo "$COLLABS_RESP"
if echo "$COLLABS_RESP" | grep -q "collabuser"; then
  echo "FAIL: User listed before accepting invite"
  exit 1
fi
echo "PASS"

# 12. Test POST /api/collaboration/accept (unauthorized accept attempt by User A)
echo -e "\n--- Test 12: Accept invite (unauthorized attempt by User A) ---"
curl -s -X POST http://localhost:5055/api/collaboration/accept \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{\"collabId\":\"$COLLAB_ID\"}" \
  | grep -q "Unauthorized" && echo "PASS" || (echo "FAIL"; exit 1)

# 13. Test POST /api/collaboration/accept (successful accept by User B)
echo -e "\n--- Test 13: Accept invite (successful by User B) ---"
ACCEPT_RESP=$(curl -s -X POST http://localhost:5055/api/collaboration/accept \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{\"collabId\":\"$COLLAB_ID\"}")
echo "$ACCEPT_RESP"
echo "$ACCEPT_RESP" | grep -q "accepted" && echo "PASS" || (echo "FAIL"; exit 1)

# 14. Test GET /api/collaboration/project/:id (verify accepted)
echo -e "\n--- Test 14: GET collaborators after accept ---"
COLLABS_AFTER=$(curl -s -X GET http://localhost:5055/api/collaboration/project/$PROJECT_ID)
echo "$COLLABS_AFTER"
echo "$COLLABS_AFTER" | grep -q "collabuser" && echo "PASS" || (echo "FAIL"; exit 1)

# 15. Create another project and test reject invite flow
echo -e "\n--- Test 15: Create Project 2 for Reject invite flow ---"
PROJECT_2_RESP=$(curl -s -X POST http://localhost:5055/api/projects \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title":"Second Track", "description":"reject flow test", "genre":"Trap"}')
PROJECT_2_ID=$(echo "$PROJECT_2_RESP" | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

echo "Invite User B to Project 2"
INVITE_2_RESP=$(curl -s -X POST http://localhost:5055/api/collaboration/invite \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_2_ID\", \"userId\":\"$USER_B_ID\"}")
COLLAB_2_ID=$(echo "$INVITE_2_RESP" | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

echo "Reject invite by User B"
REJECT_RESP=$(curl -s -X POST http://localhost:5055/api/collaboration/reject \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{\"collabId\":\"$COLLAB_2_ID\"}")
echo "$REJECT_RESP"
echo "$REJECT_RESP" | grep -q "rejected" && echo "PASS" || (echo "FAIL"; exit 1)

# ==========================================
# MODULE 7: NOTIFICATIONS SYSTEM TESTS
# ==========================================

# 16. Test GET /api/notifications (verify invite notification exists)
echo -e "\n--- Test 16: GET /api/notifications (User B) ---"
NOTIFS_RESP=$(curl -s -X GET http://localhost:5055/api/notifications \
  -H "Authorization: Bearer $TOKEN_B")
echo "$NOTIFS_RESP"

# Find the first notification ID
NOTIF_ID=$(echo "$NOTIFS_RESP" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
if [ -z "$NOTIF_ID" ]; then
  echo "Failed to retrieve notification ID for User B!"
  exit 1
fi
echo "$NOTIFS_RESP" | grep -q "invite" && echo "$NOTIFS_RESP" | grep -q '"isRead":false' && echo "PASS. Notification ID is $NOTIF_ID" || (echo "FAIL"; exit 1)

# 17. Test PATCH /api/notifications/:id/read (mark as read)
echo -e "\n--- Test 17: PATCH /api/notifications/:id/read (mark as read) ---"
READ_RESP=$(curl -s -X PATCH http://localhost:5055/api/notifications/$NOTIF_ID/read \
  -H "Authorization: Bearer $TOKEN_B")
echo "$READ_RESP"
echo "$READ_RESP" | grep -q '"isRead":true' && echo "PASS" || (echo "FAIL"; exit 1)

# 18. Verify notification is read
echo -e "\n--- Test 18: Verify notification status updated ---"
NOTIFS_VERIFY=$(curl -s -X GET http://localhost:5055/api/notifications \
  -H "Authorization: Bearer $TOKEN_B")
echo "$NOTIFS_VERIFY" | grep -q '"isRead":true' && echo "PASS" || (echo "FAIL"; exit 1)

# 19. Verify User A (project owner) received accept and reject notifications
echo -e "\n--- Test 19: GET /api/notifications (User A - Owner) ---"
NOTIFS_A=$(curl -s -X GET http://localhost:5055/api/notifications \
  -H "Authorization: Bearer $TOKEN_A")
echo "$NOTIFS_A"
echo "$NOTIFS_A" | grep -q "accept" && echo "$NOTIFS_A" | grep -q "reject" && echo "PASS" || (echo "FAIL"; exit 1)

# ==========================================
# MODULE 8: SEARCH SYSTEM TESTS
# ==========================================

# 20. Test GET /api/search/users?q=collab
echo -e "\n--- Test 20: Search users by username (lowercase query) ---"
SEARCH_U1=$(curl -s -X GET http://localhost:5055/api/search/users?q=collab)
echo "$SEARCH_U1"
echo "$SEARCH_U1" | grep -q "collabuser" && echo "PASS" || (echo "FAIL"; exit 1)

# 21. Test GET /api/search/users?q=COLLAB (case-insensitivity check)
echo -e "\n--- Test 21: Search users by username (uppercase query) ---"
SEARCH_U2=$(curl -s -X GET http://localhost:5055/api/search/users?q=COLLAB)
echo "$SEARCH_U2"
echo "$SEARCH_U2" | grep -q "collabuser" && echo "PASS" || (echo "FAIL"; exit 1)

# 22. Test GET /api/search/projects?q=synth (title match)
echo -e "\n--- Test 22: Search projects by title ---"
SEARCH_P1=$(curl -s -X GET http://localhost:5055/api/search/projects?q=synth)
echo "$SEARCH_P1"
echo "$SEARCH_P1" | grep -q "First Synth Track" && echo "PASS" || (echo "FAIL"; exit 1)

# 23. Test GET /api/search/projects?q=ambient (genre match)
echo -e "\n--- Test 23: Search projects by genre ---"
SEARCH_P2=$(curl -s -X GET http://localhost:5055/api/search/projects?q=ambient)
echo "$SEARCH_P2"
echo "$SEARCH_P2" | grep -q "First Synth Track" && echo "PASS" || (echo "FAIL"; exit 1)

# ==========================================
# MODULE 9: ACTIVITY FEED SYSTEM TESTS
# ==========================================

# 24. Test GET /api/feed/global (verify global activities list)
echo -e "\n--- Test 24: GET /api/feed/global ---"
FEED_GLOBAL=$(curl -s -X GET http://localhost:5055/api/feed/global)
echo "$FEED_GLOBAL"
echo "$FEED_GLOBAL" | grep -q "project_created" && echo "$FEED_GLOBAL" | grep -q "invite_sent" && echo "$FEED_GLOBAL" | grep -q "invite_accepted" && echo "$FEED_GLOBAL" | grep -q "invite_rejected" && echo "PASS" || (echo "FAIL"; exit 1)

# 25. Test GET /api/feed/me (verify user personal feed contains project_created)
echo -e "\n--- Test 25: GET /api/feed/me (User A) ---"
FEED_ME=$(curl -s -X GET http://localhost:5055/api/feed/me \
  -H "Authorization: Bearer $TOKEN_A")
echo "$FEED_ME"
echo "$FEED_ME" | grep -q "project_created" && echo "PASS" || (echo "FAIL"; exit 1)

# ==========================================
# MODULE 10: SECURITY HARDENING & BOLA TESTS
# ==========================================

# 26. Test POST /api/collaboration/invite (unauthorized invite attempt by User B to User A's project)
echo -e "\n--- Test 26: Invite collaborator (unauthorized attempt by User B on Project A) ---"
curl -s -X POST http://localhost:5055/api/collaboration/invite \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\", \"userId\":\"$USER_B_ID\"}" \
  | grep -q "Unauthorized" && echo "PASS" || (echo "FAIL"; exit 1)

# 27. Test GET /api/chat/:projectId (unauthorized chat history fetch by User B for a project they aren't part of)
echo -e "\n--- Test 27: GET /api/chat/:projectId (unauthorized chat history fetch by User B on Project 2) ---"
curl -s -X GET http://localhost:5055/api/chat/$PROJECT_2_ID \
  -H "Authorization: Bearer $TOKEN_B" \
  | grep -q "Unauthorized" && echo "PASS" || (echo "FAIL"; exit 1)

# 28. Test PATCH /api/notifications/:id/read (unauthorized mark as read by User A on User B's notification)
echo -e "\n--- Test 28: PATCH /api/notifications/:id/read (unauthorized mark read by User A on B's notification) ---"
curl -s -X PATCH http://localhost:5055/api/notifications/$NOTIF_ID/read \
  -H "Authorization: Bearer $TOKEN_A" \
  | grep -q "Unauthorized" && echo "PASS" || (echo "FAIL"; exit 1)

# 29. Test DELETE /api/projects/:id (unauthorized delete attempt by User B on User A's project)
echo -e "\n--- Test 29: DELETE /api/projects/:id (unauthorized delete attempt by User B) ---"
curl -s -X DELETE http://localhost:5055/api/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN_B" \
  | grep -q "Unauthorized" && echo "PASS" || (echo "FAIL"; exit 1)

# 30. Test DELETE /api/projects/:id (successful delete by owner User A)
echo -e "\n--- Test 30: DELETE /api/projects/:id (successful delete by owner User A) ---"
curl -s -X DELETE http://localhost:5055/api/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN_A" \
  | grep -q "Project deleted" && echo "PASS" || (echo "FAIL"; exit 1)

echo -e "\nAll tests passed successfully! 🎉"
