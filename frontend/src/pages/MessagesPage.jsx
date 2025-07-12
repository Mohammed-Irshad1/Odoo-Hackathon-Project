import React, { useEffect, useState, useRef } from 'react';
import { ListGroup, Card, Row, Col, Spinner, Alert, Button, Form, Image } from 'react-bootstrap';
import api from '../api/axios';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';

const bubbleColors = [
  '#e0f7fa', // user
  '#fce4ec'  // other
];

const avatarColors = [
  '#00bcd4', '#ffb300', '#8bc34a', '#e91e63', '#9c27b0', '#ff5722', '#607d8b'
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/users/messages', { headers: { Authorization: `Bearer ${token}` } });
        setConversations(res.data);
      } catch (err) {
        setError('Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = async (otherUserId, itemId, partnerName, itemTitle) => {
    setSelected({ otherUserId, itemId, partnerName, itemTitle });
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/users/messages/conversation', {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: otherUserId, itemId }
      });
      setMessages(res.data);
    } catch (err) {
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await api.post('/users/messages', {
        receiverId: selected.otherUserId,
        itemId: selected.itemId,
        content: messageText
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessageText('');
      openConversation(selected.otherUserId, selected.itemId, selected.partnerName, selected.itemTitle);
    } catch {
      alert('Failed to send message.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Messages</h2>
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={4} style={{ borderRight: '2px solid #eee', minHeight: 500 }}>
          <div className="mb-3 fw-bold text-secondary">Inbox</div>
          <ListGroup style={{ borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
            {conversations.map(conv => {
              const partnerId = conv.sender_id === userId ? conv.receiver_id : conv.sender_id;
              const partnerName = conv.sender_id === userId ? conv.receiver_name : conv.sender_name;
              const itemTitle = conv.item_title || `Item #${conv.item_id}`;
              return (
                <ListGroup.Item
                  key={conv.id}
                  action
                  active={selected && partnerId === selected.otherUserId && conv.item_id === selected.itemId}
                  onClick={() => openConversation(partnerId, conv.item_id, partnerName, itemTitle)}
                  style={{ border: 0, borderRadius: 8, marginBottom: 4, background: '#fafbfc' }}
                  className="d-flex align-items-center gap-2"
                >
                  <div style={{ background: getAvatarColor(partnerName), color: 'white', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {getInitials(partnerName)}
                  </div>
                  <div>
                    <div className="fw-bold">{partnerName}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>{itemTitle}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{conv.content.slice(0, 30)}...</div>
                  </div>
                </ListGroup.Item>
              );
            })}
            {!loading && conversations.length === 0 && <div className="text-center">No conversations yet.</div>}
          </ListGroup>
        </Col>
        <Col md={8} style={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
          {selected ? (
            <Card style={{ borderRadius: 16, boxShadow: '0 2px 12px #eee', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Card.Header className="d-flex align-items-center gap-2" style={{ background: '#f5f5f5', borderRadius: '16px 16px 0 0' }}>
                <div style={{ background: getAvatarColor(selected.partnerName), color: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {getInitials(selected.partnerName)}
                </div>
                <div>
                  <div className="fw-bold">{selected.partnerName}</div>
                  <div className="text-muted" style={{ fontSize: 13 }}>{selected.itemTitle}</div>
                </div>
              </Card.Header>
              <Card.Body style={{ background: '#f9f9f9', flex: 1, overflowY: 'auto', paddingBottom: 0 }}>
                {messages.map(msg => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div key={msg.id} className="d-flex mb-2" style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      {!isMe && (
                        <div style={{ background: getAvatarColor(msg.sender_name), color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginRight: 8 }}>
                          {getInitials(msg.sender_name)}
                        </div>
                      )}
                      <div style={{ maxWidth: '70%', background: isMe ? bubbleColors[0] : bubbleColors[1], borderRadius: 18, padding: '8px 16px', boxShadow: '0 1px 4px #eee', color: '#333', position: 'relative' }}>
                        <div style={{ fontSize: 15 }}>{msg.content}</div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2, textAlign: isMe ? 'right' : 'left' }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      {isMe && (
                        <div style={{ background: getAvatarColor('Me'), color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginLeft: 8 }}>
                          {getInitials('Me')}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </Card.Body>
              <Card.Footer style={{ background: '#f5f5f5', borderRadius: '0 0 16px 16px', position: 'sticky', bottom: 0 }}>
                <Form className="d-flex" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    style={{ borderRadius: 18, background: '#fff' }}
                  />
                  <Button type="submit" variant="primary" className="ms-2" style={{ borderRadius: 18, minWidth: 80 }}>Send</Button>
                </Form>
              </Card.Footer>
            </Card>
          ) : (
            <div className="text-center text-muted" style={{ marginTop: 100, fontSize: 18 }}>Select a conversation to view messages.</div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MessagesPage; 