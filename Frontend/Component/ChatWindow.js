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

      <div class="message received">
        <div class="time"></div>
      </div>

      <div class="message sent">
        <div class="time"></div>
      </div>

    </div>

    <div class="chat-input">
      <input type="text" id="msg-input" placeholder="Type a message..." />
      <button onclick="sendMessage()">Send</button>
    </div>

  </div>
`;
    return container;
}