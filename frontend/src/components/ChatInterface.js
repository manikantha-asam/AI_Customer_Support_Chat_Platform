// frontend/src/components/ChatInterface.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSignOutAlt, faDownload, faFilePdf, faUserShield, faRobot } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // Import remark-gfm for tables, strikethrough, etc.

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/chat/history');
        if (res.data.messages) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };
    fetchHistory();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp: new Date() }]);
    setInput('');
    setTyping(true);
    try {
      const res = await api.post('/api/chat/send', { userMessage });
      const botResponse = res.data.botResponse;
      setMessages(prev => [...prev, { role: 'bot', text: botResponse, timestamp: new Date() }]);
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to get response from bot.');
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting. Please try again.', timestamp: new Date() }]);
    } finally {
      setTyping(false);
    }
  };

  const handleDownload = (format) => {
    if (messages.length === 0) {
      return toast.info('No messages to download.');
    }

    if (format === 'txt') {
      const chatContent = messages.map(msg => `${msg.role === 'user' ? 'You' : 'Bot'}: ${msg.text} (${new Date(msg.timestamp).toLocaleString()})`).join('\n\n');
      const blob = new Blob([chatContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat-history-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Chat downloaded as TXT!');
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      let y = 15;
      const margin = 15;
      const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;

      doc.setFontSize(12);
      doc.text("Chat History", margin, y);
      y += 10;
      
      messages.forEach(msg => {
        const userLabel = msg.role === 'user' ? 'You' : 'Bot';
        const text = `${userLabel}: ${msg.text}`;
        const timestamp = new Date(msg.timestamp).toLocaleString();
        
        const splitText = doc.splitTextToSize(text, maxWidth);
        
        if (y + (splitText.length * 7) + 5 > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = 15;
        }

        doc.text(splitText, margin, y);
        y += splitText.length * 7;

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(timestamp, margin, y);
        doc.setFontSize(12);
        doc.setTextColor(0);
        y += 5;

        y += 5;
      });
      doc.save(`chat-history-${Date.now()}.pdf`);
      toast.success('Chat downloaded as PDF!');
    }
    setExportDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!'); 
    navigate('/');
  };

  return (
    <div className="d-flex flex-column h-100 container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <FontAwesomeIcon icon={faRobot} className="me-2" />
            AI Assistant
          </a>
          <div className="d-flex ms-auto">
            {isAdmin && (
              <button 
                className="btn btn-outline-warning me-2 rounded-pill"
                onClick={() => navigate('/admin')}
              >
                <FontAwesomeIcon icon={faUserShield} className="me-1" /> Admin Panel
              </button>
            )}
            <div className="dropdown">
              <button 
                type="button" 
                className="btn btn-outline-success rounded-pill dropdown-toggle" 
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              >
                <FontAwesomeIcon icon={faDownload} className="me-1" /> Export Chat
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${exportDropdownOpen ? 'show' : ''}`}>
                <li>
                  <button className="dropdown-item" onClick={() => handleDownload('txt')}>
                    <FontAwesomeIcon icon={faDownload} className="me-1" /> Download TXT
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleDownload('pdf')}>
                    <FontAwesomeIcon icon={faFilePdf} className="me-1" /> Download PDF
                  </button>
                </li>
              </ul>
            </div>
            <button 
              className="btn btn-outline-danger rounded-pill ms-2"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="chat-container flex-grow-1 p-3 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`chat-bubble mb-2 p-3 rounded-3 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              <div className={`text-end mt-1 text-xs ${msg.role === 'user' ? 'text-white' : 'text-muted'}`}>
                <small>{formatTimestamp(msg.timestamp)}</small>
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="d-flex justify-content-start">
            <div className="chat-bubble typing-indicator bg-light text-muted mb-2 p-3 rounded-3 shadow-sm">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              <span className="ms-2">Agent is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area p-3 bg-light border-top sticky-bottom">
        <form onSubmit={handleSendMessage} className="d-flex">
          <input
            type="text"
            className="form-control rounded-pill me-2 shadow-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary rounded-circle shadow">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
