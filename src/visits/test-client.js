// test-client.js
const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id);
});

socket.on('visits_update', (data) => {
  console.log('📡 Visit update received:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});
