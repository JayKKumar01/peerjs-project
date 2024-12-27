const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');

// Initialize Express app
const app = express();

// Serve static files (HTML, JS, CSS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Get the dynamic port from Render (or default to 3000 in local dev)
const PORT = process.env.PORT || 3000;

// Initialize PeerJS server
const peerServer = PeerServer({
    port: PORT,                   // Use dynamic port provided by Render
    path: '/peerjs',               // Path used by the PeerJS client
    secure: true,                  // Use secure (https) connections
    host: 'peerjs-project.onrender.com',  // Render public URL (adjust if using custom domain)
    // Bind to all IP addresses (0.0.0.0)
    listen: '0.0.0.0'
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
