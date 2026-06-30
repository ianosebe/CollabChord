#!/bin/bash
set -e

# Change directory to backend
cd "$(dirname "$0")"

echo "=== Resetting Database ==="
npx prisma db push --force-reset

echo -e "\n=== Running Auth and Core Integration Tests (test-auth.sh) ==="
bash test-auth.sh

echo -e "\n=== Running Chat Integration Tests (test-chat.js) ==="
npx prisma db push --force-reset
PORT=5055 node src/server.js > test-server-chat.log 2>&1 &
CHAT_PID=$!
cleanup_chat() {
  kill $CHAT_PID || true
}
trap cleanup_chat EXIT
sleep 2
node test-chat.js
kill $CHAT_PID || true
trap - EXIT

echo -e "\n=== Running Analytics Integration Tests (test-analytics.js) ==="
npx prisma db push --force-reset
PORT=5056 node src/server.js > test-server-analytics.log 2>&1 &
ANALYTICS_PID=$!
cleanup_analytics() {
  kill $ANALYTICS_PID || true
}
trap cleanup_analytics EXIT
sleep 2
node test-analytics.js
kill $ANALYTICS_PID || true
trap - EXIT

echo -e "\n=== Running Security Integration Tests (test-security.js) ==="
npx prisma db push --force-reset
PORT=5057 node src/server.js > test-server-security.log 2>&1 &
SECURITY_PID=$!
cleanup_security() {
  kill $SECURITY_PID || true
}
trap cleanup_security EXIT
sleep 2
node test-security.js
kill $SECURITY_PID || true
trap - EXIT

echo -e "\n=== Running Beat IP Protection Integration Tests (test-audio-security.js) ==="
npx prisma db push --force-reset
PORT=5058 node src/server.js > test-server-audio.log 2>&1 &
AUDIO_PID=$!
cleanup_audio() {
  kill $AUDIO_PID || true
}
trap cleanup_audio EXIT
sleep 4
node test-audio-security.js
kill $AUDIO_PID || true
trap - EXIT

echo -e "\n============================================="
echo "🎉 All integration test modules passed successfully!"
echo "============================================="
