import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../firebase.config';
import GalaxyBackground from '../components/GalaxyBackground';
import { encryptMessage, decryptMessage, validateFile, processSecureFile } from '../utils/security';
import './ChatScreen.css';

// Component for async message decryption
function MessageText({ encryptedText }) {
  const [decryptedText, setDecryptedText] = useState('Decrypting...');
  
  useEffect(() => {
    const decrypt = async () => {
      try {
        const text = await decryptMessage(encryptedText);
        setDecryptedText(text);
      } catch (error) {
        setDecryptedText(encryptedText); // Fallback to original
      }
    };
    decrypt();
  }, [encryptedText]);
  
  return <p className="message-text">{decryptedText}</p>;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [recording, setRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorder = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    initializeUser();
    loadMessages();
    const messagesSub = subscribeToMessages();
    const typingSub = subscribeToTyping();
    const statusSub = subscribeToOnlineStatus();

    // Cleanup function
    return () => {
      if (messagesSub) messagesSub();
      if (typingSub) typingSub();
      if (statusSub) statusSub();
      
      // Set user offline when leaving
      if (user?.userType) {
        supabase
          .from('user_status')
          .upsert({
            user_id: user.userType,
            is_online: false,
            last_seen: new Date().toISOString()
          });
      }
    };
  }, []);

  const initializeUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const userType = session.user.user_metadata?.user_type || 
                      (session.user.email?.includes('nelson') ? 'nelson' : 'juliana');
      const userData = { ...session.user, userType };
      setUser(userData);
      
      // Set user online
      await supabase
        .from('user_status')
        .upsert({
          user_id: userData.userType,
          is_online: true,
          last_seen: new Date().toISOString()
        });

      // Load partner's online status
      const partnerId = userData.userType === 'nelson' ? 'juliana' : 'nelson';
      const { data } = await supabase
        .from('user_status')
        .select('is_online')
        .eq('user_id', partnerId)
        .single();
      
      if (data) {
        setOnlineStatus(data.is_online);
      }
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setMessages(data);
      scrollToBottom();
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new]);
            scrollToBottom();
            
            // Mark as delivered if not sender
            const currentUserId = user?.userType;
            
            if (payload.new.sender_id !== currentUserId) {
              markAsDelivered(payload.new.id);
            }
          }
          
          if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.new.id ? payload.new : msg
            ));
          }
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const subscribeToTyping = () => {
    const subscription = supabase
      .channel('typing')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'typing_status' },
        (payload) => {
          const currentUserId = user?.userType;
          
          if (payload.new.user_id !== currentUserId) {
            setPartnerTyping(payload.new.is_typing);
          }
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const subscribeToOnlineStatus = () => {
    const subscription = supabase
      .channel('online_status')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_status' },
        (payload) => {
          const partnerId = user?.userType === 'nelson' ? 'juliana' : 'nelson';
          
          if (payload.new.user_id === partnerId) {
            setOnlineStatus(payload.new.is_online);
          }
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async () => {
    console.log('Send message called');
    console.log('New message:', newMessage);
    console.log('User:', user);
    
    if (!newMessage.trim() && !replyTo) {
      console.log('No message text');
      return;
    }
    
    // Ensure we have some text even for replies
    const messageText = newMessage.trim() || (replyTo ? 'Reply' : '');
    
    if (!user?.userType) {
      console.log('No user type');
      alert('Please refresh the page and log in again');
      return;
    }

    const senderId = user.userType;
    const receiverId = user.userType === 'nelson' ? 'juliana' : 'nelson';

    const encryptedText = await encryptMessage(messageText);
    const messageData = {
      text: encryptedText,
      sender_id: senderId,
      receiver_id: receiverId,
      message_status: 'sent'
    };

    console.log('Sending message data:', messageData);

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData);

    console.log('Insert result:', { data, error });

    if (error) {
      console.error('Message send error:', error);
      alert('Failed to send message: ' + error.message);
    } else {
      console.log('Message sent successfully');
      setNewMessage('');
      setReplyTo(null);
      stopTyping();
    }
  };

  const markAsDelivered = async (messageId) => {
    await supabase
      .from('messages')
      .update({ message_status: 'delivered' })
      .eq('id', messageId);
  };

  const markAsRead = async (messageId) => {
    await supabase
      .from('messages')
      .update({ message_status: 'read' })
      .eq('id', messageId);
  };

  const handleTyping = (text) => {
    setNewMessage(text);
    
    if (!isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const stopTyping = () => {
    setIsTyping(false);
    updateTypingStatus(false);
  };

  const updateTypingStatus = async (typing) => {
    const userId = user?.userType;

    await supabase
      .from('typing_status')
      .upsert({
        user_id: userId,
        is_typing: typing,
        updated_at: new Date().toISOString()
      });
  };

  const handleMediaUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      // Process file securely (validation + watermark + compression)
      const secureFile = await processSecureFile(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `chat_${Date.now()}.${fileExt}`;
      const filePath = `chat-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, secureFile);

      if (uploadError) {
        alert('Upload failed');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      const senderId = user?.userType;
      const receiverId = user?.userType === 'nelson' ? 'juliana' : 'nelson';

      const messageData = {
        text: file.type.startsWith('image') ? '📸 Photo' : '🎥 Video',
        sender_id: senderId,
        receiver_id: receiverId,
        message_status: 'sent',
        image_url: publicUrl,
        created_at: new Date().toISOString()
      };

      await supabase.from('messages').insert(messageData);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        await uploadVoiceMessage(blob);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      alert('Microphone access denied');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const uploadVoiceMessage = async (blob) => {
    const fileName = `voice_${Date.now()}.wav`;
    const filePath = `voice-messages/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, blob);

    if (uploadError) return;

    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    const senderId = user?.userType;
    const receiverId = user?.userType === 'nelson' ? 'juliana' : 'nelson';

    const messageData = {
      text: '🎤 Voice message',
      sender_id: senderId,
      receiver_id: receiverId,
      message_status: 'sent',
      audio_url: publicUrl,
      created_at: new Date().toISOString()
    };

    await supabase.from('messages').insert(messageData);
  };

  const addReaction = async (messageId, emoji) => {
    const userId = user?.userType;

    const message = messages.find(m => m.id === messageId);
    const reactions = message.reactions || {};
    reactions[userId] = emoji;

    await supabase
      .from('messages')
      .update({ reactions })
      .eq('id', messageId);
  };

  const isNelson = user?.userType === 'nelson';
  const partnerName = isNelson ? 'Juliana' : 'Nelson';

  return (
    <div className="chat-container">
      <GalaxyBackground />
      
      {/* Chat Header */}
      <div className="chat-header">
        <div className="partner-info">
          <div className={`partner-avatar ${isNelson ? 'juliana-avatar' : 'nelson-avatar'}`}>
            {isNelson ? 'J' : 'N'}
          </div>
          <div className="partner-details">
            <h3 className="partner-name">{partnerName}</h3>
            <p className="partner-status">
              {onlineStatus ? (
                <span className="online">◉ Online</span>
              ) : (
                <span className="offline">◯ Offline</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.map((message) => {
          const isSender = message.sender_id === user?.userType;
          const replyMessage = message.reply_to ? messages.find(m => m.id === message.reply_to) : null;
          
          return (
            <div key={message.id} className={`message ${isSender ? 'sent' : 'received'}`}>
              {replyMessage && (
                <div className="reply-preview">
                  <div className="reply-line"></div>
                  <div className="reply-content">
                    <span className="reply-author">{replyMessage.sender_id}</span>
                    <span className="reply-text">{replyMessage.text}</span>
                  </div>
                </div>
              )}
              
              <div className="message-bubble">
                {message.image_url && (
                  <img src={message.image_url} alt="Shared media" className="message-media" />
                )}
                
                {message.audio_url && (
                  <audio controls className="message-audio">
                    <source src={message.audio_url} type="audio/wav" />
                  </audio>
                )}
                
                <MessageText encryptedText={message.text} />
                
                <div className="message-footer">
                  <span className="message-time">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  
                  {isSender && (
                    <span className={`message-status ${message.message_status}`}>
                      {message.message_status === 'sent' && '✓'}
                      {message.message_status === 'delivered' && '✓✓'}
                      {message.message_status === 'read' && '✓✓'}
                    </span>
                  )}
                </div>
                
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="message-reactions">
                    {Object.entries(message.reactions).map(([userId, emoji]) => (
                      <span key={userId} className="reaction">
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="message-actions">
                <button onClick={() => setReplyTo(message)} className="action-btn">
                  ↩
                </button>
                <button onClick={() => addReaction(message.id, '❤️')} className="action-btn">
                  ❤️
                </button>
                <button onClick={() => addReaction(message.id, '😂')} className="action-btn">
                  😂
                </button>
                <button onClick={() => addReaction(message.id, '👍')} className="action-btn">
                  👍
                </button>
              </div>
            </div>
          );
        })}
        
        {partnerTyping && (
          <div className="typing-indicator">
            <div className="typing-bubble">
              <span>{partnerName} is typing</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyTo && (
        <div className="reply-bar">
          <div className="reply-info">
            <span className="reply-label">Replying to {replyTo.sender_id}</span>
            <span className="reply-preview-text">{replyTo.text}</span>
          </div>
          <button onClick={() => setReplyTo(null)} className="cancel-reply">
            ✕
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        <input
          type="file"
          id="media-upload"
          accept="image/*,video/*"
          onChange={handleMediaUpload}
          style={{ display: 'none' }}
        />
        
        <button className="media-btn" onClick={() => document.getElementById('media-upload').click()}>
          📎
        </button>
        
        <div className="input-container">
          <input
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </div>
        
        {newMessage.trim() ? (
          <button className="send-btn" onClick={sendMessage}>
            ➤
          </button>
        ) : (
          <button 
            className={`voice-btn ${recording ? 'recording' : ''}`}
            onMouseDown={startVoiceRecording}
            onMouseUp={stopVoiceRecording}
            onTouchStart={startVoiceRecording}
            onTouchEnd={stopVoiceRecording}
          >
            🎤
          </button>
        )}
      </div>
    </div>
  );
}