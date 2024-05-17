import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './index.css';

function App2() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [peerId, setPeerId] = useState('');
  const [publicIp, setPublicIp] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      if (window.__TAURI_IPC__) {
        console.log('Fetching messages');
        const response = await invoke('get_messages');
        console.log('Messages fetched:', response);
        setMessages(response);
      } else {
        console.log('Tauri environment not detected.');
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        console.log('Sending message:', message);
        await invoke('send_message', { message });
        setMessage('');
        fetchMessages();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleConnect = async () => {
    if (publicIp.trim() && peerId.trim()) {
      const multiaddr = `/ip4/${publicIp}/udp/9090/webrtc-direct/p2p/${peerId}`;
      try {
        console.log('Connecting to peer:', multiaddr);
        await invoke('connect_peer', { multiaddr });
        console.log(`Connected to peer ${peerId} at ${publicIp}`);
      } catch (error) {
        console.error('Failed to connect to peer:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Ebe Nuka?</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
      <input
        type="text"
        value={publicIp}
        onChange={(e) => setPublicIp(e.target.value)}
        placeholder="Enter Public IP"
      />
      <input
        type="text"
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
        placeholder="Enter Peer ID"
      />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
}

export default App2;
