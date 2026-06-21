import { API_URL } from '../Src/Config.js';
import socket from '../SocketIo_instance/socket.js';

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message);
});
export function ChatWindow(conversation, id, isGroup, name,onBack) {
  const container = document.createElement('div');
  container.innerHTML = `
      <div class="chat-box">

      <div class="chat-header">
       <button id="backBtn">←</button>

        <div class="avatar">${name ? name.charAt(0).toUpperCase() : ''}</div>
        <div class="header-text">
          <h3>${name || ''}</h3>
          <p></p>
        </div>
      </div>

      <div class="messages" id="messages">

      </div>
      <div id="ai-suggestions"></div>
      <div id="smart-replies"></div>
      <div class="chat-input">
        <input type="text" id="msg-input" placeholder="Type a message..." />

        <input type="file" id="file-input"/>
        <button id="send-btn">Send</button>
      </div>

  </div>
`;
  const currentUserId = Number(localStorage.getItem('userId'));
  let conversationId = conversation;
  let receiverId = id;
    async function uploadFile(file) {
  
      const formData = new FormData();
      
      formData.append('file', file);
  
      const response = await axios.post(`${API_URL}/upload`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
  
      return {
        url: response.data.url,
        type: file.type
      }
    }
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

    const msgDiv = document.createElement('div');

    const name = localStorage.getItem('username');

    if (msg.senderId === currentUserId) {
      msgDiv.className = 'message sent'
    }
    else {
      msgDiv.className = 'message received'
    }

    let content = "";
    if (msg.text) {
      content += `<p>${msg.text}</p>`;
    }
    if (msg.mediaUrl) {
      let type = msg.mediaType ? msg.mediaType.toLowerCase() : "";
      
      if (!type) {
        const lowerUrl = msg.mediaUrl.toLowerCase();
        if (lowerUrl.includes(".jpg") || lowerUrl.includes(".jpeg") || lowerUrl.includes(".png") || lowerUrl.includes(".gif") || lowerUrl.includes(".webp")) {
          type = "image";
        } else if (lowerUrl.includes(".mp4") || lowerUrl.includes(".webm") || lowerUrl.includes(".mov")) {
          type = "video";
        } else if (lowerUrl.includes(".pdf")) {
          type = "pdf";
        }
      }

      if (type.startsWith("image") || type === "image") {
        content += `<img src="${msg.mediaUrl}" style="width:200px;border-radius:10px;" alt="Shared Image">`;
      } 
      else if (type.startsWith("video") || type === "video") {
        content += `<video controls width="250"> <source src="${msg.mediaUrl}"></video>`;
      } 
      else if (type === "application/pdf" || type === "pdf") {
        content += `<a href="${msg.mediaUrl}" target="_blank" style="color: #007bff; font-weight: bold; text-decoration: underline;">📄 Open PDF File</a>`;
      } 
      else {
        content += `<a href="${msg.mediaUrl}" target="_blank" style="color: #007bff; font-weight: bold; text-decoration: underline;">📁 Download Attached File</a>`;
      }
    }
    if (isGroup) {
      const senderName = msg.Signup?.name || msg.senderName;
      msgDiv.innerHTML = `
            <strong>${senderName === name ? 'You' : senderName}</strong>
            ${content}
            <div class="time">${new Date(msg.createdAt).toLocaleTimeString()}</div>
          `
    }
    else {
      msgDiv.innerHTML = `
            ${content}  
            <div class="time">${new Date(msg.createdAt).toLocaleTimeString()}</div>
          `
    }
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
  function handlePrivateMessage(msg) {
    if (isGroup) return;
    if(!conversationId){
      conversationId = conversationId ? msg.dataValues.conversationId : null;

      addMessage(msg);

      return;
    }
    if (conversationId && Number(conversationId) === Number(msg.conversationId)) {
      addMessage(msg);
    }
  }

  function handleGroupMessage(msg) {
    if (!isGroup) return;
    if (Number(conversationId) === Number(msg.conversationId)) {
      addMessage(msg);
    }
  }
  if (isGroup && conversationId) {
    socket.emit('join-group-room', conversationId);
  }
  else if (conversationId) {
    socket.emit('join-room', conversationId);
  }
  async function sendMessage() {
    const msgInput = container.querySelector('#msg-input');

    const fileInput = container.querySelector('#file-input');

    const sendBtn = container.querySelector('#send-btn');
    const text = msgInput.value.trim();

    const file = fileInput.files[0];

    let mediaUrl = null;

    let mediaType = null;

    try{
      sendBtn.disabled = true;

      container.querySelector('#ai-suggestions').innerHTML="";
      container.querySelector('#smart-replies').innerHTML="";
    
      if (file) {
        const upload = await uploadFile(file);
        mediaUrl = upload.url;
        mediaType = upload.type;
      }
      if (!text && !mediaUrl) {
        return;
      }
      if (isGroup) {
        const name = localStorage.getItem('username');
        socket.emit('sendGroup-message', {

          conversationId,
          senderId: currentUserId,
          senderName: name,
          text,
          mediaUrl,
          mediaType,
          createdAt: new Date()

        });

      }
      else if (conversationId && !isGroup) {
        socket.emit('sendMessage', {

          type: 'conversation',
          conversationId,
          senderId: currentUserId,
          text,
          mediaUrl,          // This part of mediaUrl and mediaType may cause bug be careful!
          mediaType,
          createdAt: new Date()

        });
      }
      else {
        socket.emit('sendMessage', {

          type: 'receiver',
          receiverId,
          senderId: currentUserId,
          text,
          mediaUrl,
          mediaType,
          createdAt: new Date()
        });
      }
      msgInput.value = '';
      fileInput.value = '';
  }
  catch(err){
    console.log("Upload error:", err);
  }
  finally {
    sendBtn.disabled = false;
  }
}
  socket.off('receiveMessage');
  socket.off('receiveGroup-message');

  socket.on('receiveMessage', handlePrivateMessage);
  socket.on('receiveGroup-message', handleGroupMessage);

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
  container._cleanup = () => {
    socket.off('receiveMessage', handlePrivateMessage);
    socket.off('receiveGroup-message', handleGroupMessage);
  };
  msgInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      await sendMessage();
    }
  });
  const backBtn = container.querySelector('#backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
        if (onBack) {
            onBack();
        }
    });
}
  return container;
}