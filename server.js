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
    host: 'peerjs-project.onrender.com',  // Use the Render domain (it will be the public URL)
    // if needed, you can use 'withCredentials' and other parameters here
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

