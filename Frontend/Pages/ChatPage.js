import {Sidebar} from '../Component/Sidebar.js';
import {ChatWindow} from '../Component/ChatWindow.js';

export function ChatPage(navigate){

    const container = document.createElement('div');
    container.className = 'chat-page';

    let selectedConversation  = null;
    const sidebar = Sidebar({
        onSelectedUser:(conversation,id)=>{
            selectedConversation = conversation;
            selectedRecieverId = id;
            renderChatWindow();
        }
    });

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';

    function renderChatWindow(){

        chatContainer.innerHTML = '';

        if(!selectedConversation){
            chatContainer.innerHTML = `
                <div class="empty-chat">
                    Select a conversation
                </div>
             `;
             return;
        }
        const chatwindow = ChatWindow(selectedConversation,selectedRecieverId);

        chatContainer.appendChild(chatwindow);
    }
    renderChatWindow();

    container.appendChild(sidebar);
    container.appendChild(chatContainer);


    return container;
}