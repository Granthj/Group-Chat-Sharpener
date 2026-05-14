export function Sidebar({ onSelectConversation }) {

    const container = document.createElement('div');

    container.className = 'sidebar';

    container.innerHTML = `
    
        <div class="sidebar-top">

            <h2 class="sidebar-title">Chats</h2>

            <div class="search-box">
                <input 
                    type="text" 
                    id="search-user" 
                    placeholder="Search users..."
                />
            </div>

        </div>

        <div class="conversation-list"></div>
    `;

    const users = [
        {
            id: 1,
            name: 'Aman',
            lastMessage: 'Hey bro',
            time: '10:30 AM',
            conversationId: 1
        },
        {
            id: 2,
            name: 'Priya',
            lastMessage: 'Where are you?',
            time: '11:15 AM',
            conversationId: 2
        },
        {
            id: 3,
            name: 'Rahul',
            lastMessage: 'Okay done',
            time: 'Yesterday',
            conversationId: 3
        }
    ];

    const conversationList = container.querySelector('.conversation-list');

    function renderUsers(list) {

        conversationList.innerHTML = '';

        list.forEach(user => {

            const userDiv = document.createElement('div');

            userDiv.className = 'conversation-item';

            userDiv.innerHTML = `
            
                <div class="avatar">
                    ${user.name.charAt(0).toUpperCase()}
                </div>

                <div class="conversation-content">

                    <div class="conversation-header">

                        <h4>${user.name}</h4>

                        <span class="time">
                            ${user.time}
                        </span>

                    </div>

                    <p class="last-message">
                        ${user.lastMessage}
                    </p>

                </div>
            `;

            userDiv.addEventListener('click', () => {

                document
                    .querySelectorAll('.conversation-item')
                    .forEach(item => {
                        item.classList.remove('active');
                    });

                userDiv.classList.add('active');

                onSelectConversation(user);
            });

            conversationList.appendChild(userDiv);
        });
    }

    renderUsers(users);

    const searchInput = container.querySelector('#search-user');

    searchInput.addEventListener('input', (e) => {

        const value = e.target.value.toLowerCase();

        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(value)
        );

        renderUsers(filteredUsers);
    });

    return container;
}