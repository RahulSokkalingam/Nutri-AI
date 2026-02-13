import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am Nutri AI, your personal diet and fitness coach. How can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const [userId, setUserId] = useState(localStorage.getItem('nutri_ai_user_id'));

    useEffect(() => {
        if (!userId) {
            const newId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('nutri_ai_user_id', newId);
            setUserId(newId);
        }
        scrollToBottom();
    }, [messages, userId]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: input,
                userId: userId
            });

            if (response.data && response.data.response) {
                const botMessage = { role: 'assistant', content: response.data.response };
                setMessages((prev) => [...prev, botMessage]);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            if (error.response && error.response.data && error.response.data.details) {
                errorMessage = `Error: ${error.response.data.details}`;
            }
            setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
                        <div className="avatar">
                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div className="content">
                            {msg.content ? msg.content.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            )) : <p className="error-text">Message content unavailable</p>}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message bot-message loading">
                        <div className="avatar"><Bot size={20} /></div>
                        <div className="content">
                            <Loader2 className="animate-spin" size={20} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} disabled={loading || !input.trim()}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default Chat;
