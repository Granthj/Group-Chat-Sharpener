import {API_URL} from '../Src/Config.js';

// window.addEventListener('DOMContentLoaded',()=>{
//   loadChatMessage(1);
// })
export function ChatWindow() {

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="chat-box">

      <div class="chat-header">
        <div class="avatar"></div>
        <div class="header-text">
          <h3></h3>
          <p></p>
        </div>
      </div>

      <div class="messages" id="messages">

      </div>

      <div class="chat-input">
        <input type="text" id="msg-input" placeholder="Type a message..." />
        <button onclick="sendMessage()">Send</button>
      </div>

  </div>
`;

  async function loadChatMessage(conversationId){

    try{

      const response = await axios.get(`${API_URL}/message/${conversationId}`);

      const msgContainer = container.getElementById('messages');

      msgContainer.innerHTML = '';

      response.data.message.forEach(msg=>{

        const msgDiv = document.createElement('div');
        
        if(msg.senderId === 101){  // this hard coded value will change with user id who logged in
          msgDiv.className = 'message sent'
        }
        else{
          msgDiv.className = 'message received'
        }

        msgDiv.innerHTML = `
          <p>${msg.text}</p>
          <div class="time">${new Date(msg.createdAt).toLocaleTimeString()}</div>
        `
        msgContainer.appendChild(msgDiv);
      });
    }
    catch(err){
      const chatBox = container.querySelector('.chat-box');
      const messages = container.querySelector('#messages');

      const errorExists = container.querySelector('#error-msg-div');
      if(errorExists){
        errorExists.remove();
      }
      const errorDiv = document.createElement('div');
      const errorMsg = document.createElement('p');
      errorMsg.textContent = "Unable to load message. Try again or refresh";
      errorMsg.id = 'error-msg';
      errorDiv.id = 'error-msg-div';

      errorDiv.appendChild(errorMsg);

      chatBox.insertBefore(errorDiv,messages);
    }
  }
  loadChatMessage(1);
    return container;
}