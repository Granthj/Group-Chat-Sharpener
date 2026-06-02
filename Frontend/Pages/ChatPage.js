import {Sidebar} from '../Component/Sidebar.js';
import {ChatWindow} from '../Component/ChatWindow.js';

export function ChatPage(navigate){
    
    const container = document.createElement('div');
    container.className = 'chat-page';

    let selectedConversation  = null;
    let selectedRecieverId = null;
    let isGroupTrue = false;
    let selectedName = null;
    const sidebar = Sidebar({
        onSelectedUser:(conversation,id,isGroup,name)=>{
            // console.log('selected', conversation, id, isGroup,name);
            selectedConversation = conversation;
            selectedRecieverId = id;
            isGroupTrue = isGroup;
            selectedName = name
            renderChatWindow();
        }
    });

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';

    function renderChatWindow(){

        chatContainer.innerHTML = '';

        if(selectedConversation === null && selectedRecieverId === null){
            chatContainer.innerHTML = `
                <div class="empty-chat">
                    Select a conversation
                </div>
             `;
             return;
        }
        const chatwindow = ChatWindow(selectedConversation,selectedRecieverId,isGroupTrue,selectedName);

        chatContainer.appendChild(chatwindow);
    }
    renderChatWindow();

    container.appendChild(sidebar);
    container.appendChild(chatContainer);


    return container;
}