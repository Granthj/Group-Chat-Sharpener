import { Sidebar } from '../Component/Sidebar.js';
import { ChatWindow } from '../Component/ChatWindow.js';

export function ChatPage(navigate) {

    const container = document.createElement('div');
    container.className = 'chat-page';

    let selectedConversation = null;
    let selectedRecieverId = null;
    let isGroupTrue = false;
    let selectedName = null;
    let isMobileChat = false;
    const sidebar = Sidebar({
        onSelectedUser: (conversation, id, isGroup, name) => {

            selectedConversation = conversation;
            selectedRecieverId = id;
            isGroupTrue = isGroup;
            selectedName = name;
            isMobileChat = true;

            renderChatWindow();
            updateMobileView();
        }
    });

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';

    function updateMobileView() {

        if (window.innerWidth > 768) {
            sidebar.style.display = 'flex';
            chatContainer.style.display = 'block';
            return;
        }

        if (isMobileChat) {
            sidebar.style.display = 'none';
            chatContainer.style.display = 'block';
        } else {
            sidebar.style.display = 'flex';
            chatContainer.style.display = 'none';
        }
    }
    function renderChatWindow() {

        const prev = chatContainer.querySelector('[data-chat-window]');
        if (prev && prev._cleanup) prev._cleanup();
        chatContainer.innerHTML = '';

        if (selectedConversation === null && selectedRecieverId === null) {
            chatContainer.innerHTML = `
                <div class="empty-chat">
                    Select a conversation
                </div>
             `;
            return;
        }
        const chatwindow = ChatWindow(selectedConversation, selectedRecieverId, isGroupTrue, selectedName,()=>{isMobileChat = false; updateMobileView();});
        chatwindow.setAttribute('data-chat-window', 'true');
        chatContainer.appendChild(chatwindow);
    }
    renderChatWindow();

    container.appendChild(sidebar);
    container.appendChild(chatContainer);
    updateMobileView();

    window.addEventListener('resize', updateMobileView);

    return container;
}