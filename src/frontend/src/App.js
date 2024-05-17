import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { invoke } from '@tauri-apps/api/tauri';
import './index.css';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const [peerId, setPeerId] = useState('');
  const [myPeerId, setMyPeerId] = useState('');
  const [myPublicIp, setMyPublicIp] = useState('');
  const [targetPeerId, setTargetPeerId] = useState('');
  const [targetPeerAddress, setTargetPeerAddress] = useState('');
  const [loading, setLoading] = useState(true);
  // const peerRef = useRef(null);

  useEffect(() => {
    const fetchPeerInfo = async () => {
      try {
        const peerInfo = await invoke('get_peer_info');
        setMyPeerId(peerInfo.peer_id);
        setMyPublicIp(peerInfo.public_ip);
        setLoading(false);
      } catch (error) {
        console.error('Failed to get peer info:', error);
      }
    };

    fetchPeerInfo();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() && targetPeerId) {
      try {
        await invoke('send_message', { peerId: targetPeerId, message });
        setMessage('');
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleConnect = async () => {
    try {
      await invoke('connect_to_peer', { peerId: targetPeerId, peerAddress: targetPeerAddress });
    } catch (error) {
      console.error('Failed to connect to peer:', error);
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
        value={targetPeerId}
        onChange={(e) => setTargetPeerId(e.target.value)}
        placeholder="Enter Target Peer ID"
      />
      <input
        type="text"
        value={targetPeerAddress}
        onChange={(e) => setTargetPeerAddress(e.target.value)}
        placeholder="Enter Target Peer Address"
      />
      <button onClick={handleConnect}>Connect</button>
      {loading ? (
        <div className="loading">
          <div className="loader"></div>
        </div>
      ) : (
        <div id="peerIdLabel">
          My Peer ID: <span className='peerIdtext'>{myPeerId}</span>
          <br />
          My Public IP: <span className='peerIdtext'>{myPublicIp}</span>
        </div>
      )}
    </div>
  );
}

export default App;
