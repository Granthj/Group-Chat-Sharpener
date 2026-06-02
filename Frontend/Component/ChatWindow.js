import { API_URL } from '../Src/Config.js';
// import { io } from 'socket.io-client';
const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token')
  }
});

// socket.on('connect', () => {
// });

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
});
export function ChatWindow(conversation, id,isGroup,name) {
  const container = document.createElement('div');
  container.innerHTML = `
      <div class="chat-box">

      <div class="chat-header">
        <div class="avatar">${name ? name.charAt(0).toUpperCase() : ''}</div>
        <div class="header-text">
          <h3>${name || ''}</h3>
          <p></p>
        </div>
      </div>

      <div class="messages" id="messages">

      </div>

      <div class="chat-input">
        <input type="text" id="msg-input" placeholder="Type a message..." />
        <button id="send-btn">Send</button>
      </div>

  </div>
`;
  const currentUserId = Number(localStorage.getItem('userId'));
  let conversationId = conversation;
  let receiverId = id;
  // console.log(conversationId,'group id');

  async function loadChatMessage(conversationId) {

    try {
      const response = await axios.get(`${API_URL}/message/${conversationId}`);

      const msgContainer = container.querySelector('#messages');

      msgContainer.innerHTML = '';

      response.data.message.forEach(msg => {

        addMessage(msg);
      });

    }
    catch (err) {
      const chatBox = container.querySelector('.chat-box');
      const messages = container.querySelector('#messages');

      const errorExists = container.querySelector('#error-msg-div');
      if (errorExists) {
        errorExists.remove();
      }
      const errorDiv = document.createElement('div');
      const errorMsg = document.createElement('p');
      errorMsg.textContent = "Unable to load message. Try again or refresh";
      errorMsg.id = 'error-msg';
      errorDiv.id = 'error-msg-div';

      errorDiv.appendChild(errorMsg);

      chatBox.insertBefore(errorDiv, messages);
    }
  }
  function addMessage(msg) {

    const msgContainer = container.querySelector('#messages');

    // msgContainer.innerHTML = '';
    const msgDiv = document.createElement('div');

    const name = localStorage.getItem('username');

    if (msg.senderId === currentUserId) {
      msgDiv.className = 'message sent'
    }
    else {
      msgDiv.className = 'message received'
    }
    if(isGroup){
      const senderName = msg.Signup?.name || msg.senderName;
      // console.log(msg.senderName,'sender name in chat window');
      msgDiv.innerHTML = `
            <strong>${msg.senderName === name ? 'You' : msg.senderName}</strong>
            <p>${msg.text}</p>
            <div class="time">${new Date(msg.createdAt).toLocaleTimeString()}</div>
          `
    }
    else{
      msgDiv.innerHTML = `
            <p>${msg.text}</p>
            <div class="time">${new Date(msg.createdAt).toLocaleTimeString()}</div>
          `
    }
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
  if(isGroup && conversationId) {
    socket.emit('join-group-room', conversationId);
  }
  else if(conversationId) {
    socket.emit('join-room', conversationId);
  }
  function sendMessage() {
    const msgInput = container.querySelector('#msg-input');
    const text = msgInput.value.trim();
    
    if (!text) {
      return;
    }
    if(isGroup){
      const name = localStorage.getItem('username');
      socket.emit('sendGroup-message', {
        
        conversationId,
        senderId: currentUserId,
        senderName: name,
        text,
        createdAt: new Date()
        
      });
      // console.log('sending group message',text);
    }
    else if(conversationId) {
      socket.emit('sendMessage', {
        
        type: 'conversation',
        conversationId,
        senderId: currentUserId,
        text,
        createdAt: new Date()
        
      });
    }
    else {
      socket.emit('sendMessage', {

        type: 'receiver',
        receiverId,
        senderId: currentUserId,
        text,
        createdAt: new Date()
      });
    }
    msgInput.value = '';
  }
  socket.off('receiveMessage');
  socket.on('receiveMessage', (msg) => {
    if(isGroup) return;

    if (!conversationId) {
      conversationId = msg.conversationId;
      socket.emit('join-room', conversationId);
    }
    if (conversationId === msg.conversationId) {
      // console.log('new message', msg);
      addMessage(msg);
    }
  });
  socket.off('receiveGroup-message');

  socket.on('receiveGroup-message', (msg) => {
    console.log('new group message', msg);

    if(!isGroup) return;
    if (conversationId === msg.conversationId) {
      addMessage(msg);
    }
  });
  const msgInput = container.querySelector('#msg-input');
  msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  const sendBtn = container.querySelector('#send-btn');
  sendBtn.addEventListener('click', sendMessage);


  if (conversationId) {

    loadChatMessage(conversationId);
  }
  return container;
}