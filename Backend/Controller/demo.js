async function loadMessages(conversationId) {

  try {

    const response = await axios.get(
      `http://localhost:3000/messages/${conversationId}`
    );

    const messages = response.data.messages;

    const messagesContainer =
      document.getElementById("messages");

    messagesContainer.innerHTML = "";

    messages.forEach(msg => {

      const div = document.createElement("div");

      // suppose current logged in user = 101
      if (msg.senderId === 101) {
        div.className = "message sent";
      } else {
        div.className = "message received";
      }

      div.innerHTML = `
        <p>${msg.text}</p>
        <div class="time">
          ${new Date(msg.createdAt)
            .toLocaleTimeString()}
        </div>
      `;

      messagesContainer.appendChild(div);

    });

  } catch (error) {

    console.log(error);

  }
}