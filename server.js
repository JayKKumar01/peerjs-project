const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static("public"));

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Set up PeerJS server
const peerServer = ExpressPeerServer(server, {
    debug: true,

});

app.use("/peerjs", peerServer);
