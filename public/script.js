const peerIdDisplay = document.getElementById('my-peer-id');
const peerIdInput = document.getElementById('peer-id-input');
const connectBtn = document.getElementById('connect-btn');
const connectionStatus = document.getElementById('connection-status');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesList = document.getElementById('messages');
const peerIdLog = document.getElementById('peer-id-log');

const prefix = 'JayKKumar01-PeerJS-';
let conn;
let fullPeerId; // Full peer ID with prefix

// Function to generate a random 6-digit code appended to the custom prefix
function generatePeerId() {
    const randomCode = Math.floor(100000 + Math.random() * 900000); // 6-digit random code
    return prefix + randomCode;
}

// Log function to handle appending messages and setting log background color
function logMessage(message, isError = false) {
    const logText = peerIdLog.value;
    peerIdLog.value = `${logText}\n${message}`;
    peerIdLog.scrollTop = peerIdLog.scrollHeight;

    peerIdLog.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
}

// Reusable function to handle incoming messages for both connected peers
function handleIncomingMessages(connection) {
    connection.on('data', data => {
        const li = document.createElement('li');
        li.textContent = `Peer: ${data}`;
        messagesList.appendChild(li);
        messagesList.scrollTop = messagesList.scrollHeight;
    });
}

// Function to initialize the peer connection
function initializePeer() {
    fullPeerId = generatePeerId(); // Generate custom peer ID
    // const peer = new Peer(fullPeerId, {
    //     host: 'localhost',
    //     port: 3000,
    //     path: '/peerjs'
    // });
    const peer = new Peer(fullPeerId, {
        host: 'peerjs-project.onrender.com', // Use your Render app’s domain
        port: 443,                          // Use 443 for secure connections (HTTPS)
        secure: true,                        // Ensure connection is secure over HTTPS
        path: '/peerjs'                      // Ensure the path matches the one you used on the server
    });
    
    

    peer.on('open', () => {
        peerIdDisplay.textContent = fullPeerId.split('-').pop(); // Display only the 6-digit number
        peer.peerID = fullPeerId; // Internally store the full generated ID

        logMessage(`Peer ID generated: ${peer.id}`);
        logMessage(`Your 6-digit Peer ID: ${peerIdDisplay.textContent}`);
    });

    peer.on('connection', incomingConn => {
        conn = incomingConn;
        connectionStatus.textContent = 'Connected';

        logMessage('Connection established with remote peer.');

        // Handle incoming messages through a shared function
        handleIncomingMessages(conn);
    });

    return peer; // Return the initialized peer object for usage
}

// Function to initiate connection with another peer
function connectToPeer(peer) {
    connectBtn.addEventListener('click', () => {
        const remotePeerId = peerIdInput.value.trim();

        if (remotePeerId) {
            const fullRemotePeerId = prefix + remotePeerId;
            logMessage(`Trying to connect to peer with ID: ${fullRemotePeerId}`);

            conn = peer.connect(fullRemotePeerId);
            conn.on('open', () => {
                connectionStatus.textContent = 'Connected';
                logMessage('Connection established with remote peer.');
            });

            // Handle incoming messages through a shared function
            handleIncomingMessages(conn);

            conn.on('error', error => {
                connectionStatus.textContent = 'Error connecting';
                logMessage('Error connecting to remote peer:', error, true);
            });
        }
    });
}

// Function to handle sending a message to the remote peer
function sendMessage() {
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message && conn) {
            conn.send(message);
            const li = document.createElement('li');
            li.textContent = `You: ${message}`;
            messagesList.appendChild(li);
            messagesList.scrollTop = messagesList.scrollHeight;
            messageInput.value = '';
            logMessage(`Message sent to peer: ${message}`);
        }
    });
}

// Initialize the peer and connect to remote peer
const peer = initializePeer();
connectToPeer(peer);
sendMessage();
