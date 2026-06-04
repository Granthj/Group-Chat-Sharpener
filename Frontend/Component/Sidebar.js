import { API_URL } from '../Src/Config.js';
import { CreateGroup } from './CreateGroup.js';
import socket from '../SocketIo_instance/socket.js';

// socket.on('connect', () => {
//     console.log('SIDEBAR SOCKET', socket.id);
// });
// socket.onAny((event, ...args) => {
//     console.log('SIDEBAR EVENT:', event, args);
// });
export function Sidebar({ onSelectedUser }) {
    const username = localStorage.getItem('username');
    const container = document.createElement('div');
    container.className = 'sidebar';
    container.innerHTML = `
    
         <div class="sidebar-top">

            <h2 class="sidebar-title">Welcome ${username} your chats</h2>

            <div class="search-box">
                <input 
                    type="text" 
                    id="search-user" 
                    placeholder="Search users..."
                />
            </div>
            <div id="groupDiv">
                <button id="btnGroup">Create Group</button>
            </div>
            </div>
            
            <div class="conversation-list"></div>
            `;

    let addSubmitBtn;
    let currentModal = null;
    let isGroup = false;
    let selectedUserIdArr = [];
    let groupArr = [];
    let users = [];
    async function loadUser() {

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/get-all-users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            users = response.data.users;
            groupArr = response.data.group;

            renderAllUsers();
        }
        catch (err) {
            if (!err.response || !err.response.data) {
                const sidebarTitle = container.querySelector('.sidebar-title');
                const no_user = document.createElement('p');
                no_user.textContent = 'No user';

                sidebarTitle.appendChild(no_user);
            }
        }
    }
    function renderAllUsers(userList = users, groupList = groupArr) {
        const conversationList = container.querySelector('.conversation-list');
        conversationList.innerHTML = '';

        userList.forEach(user => {
            renderUser(user);
            // console.log(user,'rendering user in sidebar');
        });
        groupList.forEach(grp => {
            // console.log(grp,'rendering group in sidebar');
            renderGroup(grp);
        });
    }
    const btnGroup = container.querySelector('#btnGroup');
    btnGroup.addEventListener('click', () => {
        isGroup = !isGroup;

        if (!isGroup) {
            selectedUserIdArr = [];
        }
        renderAllUsers();
    });
    function renderCreateGroup() {

        const groupDiv = container.querySelector('#groupDiv');
        const oldCreateBtn = container.querySelector('#createGrpBtn');
        if (oldCreateBtn) {
            oldCreateBtn.remove();
        }
        
        if (selectedUserIdArr.length > 0) {
            addSubmitBtn = document.createElement('button');
            addSubmitBtn.id = 'createGrpBtn';
            addSubmitBtn.textContent = 'Confirm next';
            addSubmitBtn.addEventListener('click', () => {
                if(currentModal) {
                    currentModal.remove();
                }
                currentModal = CreateGroup(selectedUserIdArr, loadUser);
                document.body.appendChild(currentModal);
            });
            groupDiv.appendChild(addSubmitBtn);
        }
        else {
            if(addSubmitBtn) {
                addSubmitBtn.remove();
            }
            if(currentModal) {
                currentModal.remove();
                currentModal = null;
            }
        }

    }
    function renderUser(user) {
        const conversationList = container.querySelector('.conversation-list');
        const singleUser = document.createElement('div');

        singleUser.className = 'conversation-item';

        singleUser.innerHTML = `
        
        <div class="avatar">
        ${user.name.charAt(0).toUpperCase()}
        </div>
        
        <div class="conversation-content">
        
        <div class="conversation-header">
        
        <h4>${user.name}</h4>
        
        <span class="time">
        ${user.lastMessageAt || ''}
        </span>
        
        </div>
        
        <p class="last-message">
        ${user.lastMessage || ''}
        </p>
        </div>
        
        `;
        const checkBox = document.createElement('input');

        checkBox.type = 'checkbox';

        if (isGroup) {
            checkBox.style.display = 'block';
        }
        else {
            checkBox.style.display = 'none';
        }
        if (selectedUserIdArr.includes(user.id)) {
            checkBox.checked = true;
        }
        checkBox.addEventListener('change', (e) => {
            e.stopPropagation();

            if (checkBox.checked && !selectedUserIdArr.includes(user.id)) {
                selectedUserIdArr.push(user.id);
                renderCreateGroup();
            }
            else {
                selectedUserIdArr = selectedUserIdArr.filter(id => id !== user.id);
                renderCreateGroup();
            }
        });

        singleUser.appendChild(checkBox);
        singleUser.addEventListener('click', () => {
            if (isGroup) {
                return;
            }
            document.querySelectorAll('.conversation-item').forEach(li => {
                li.classList.remove('active');
            });
            singleUser.classList.add('active');
            onSelectedUser(user.conversationId, user.id, false, user.name);
        });
        conversationList.appendChild(singleUser);
    }
    function renderGroup(group) {
        const conversationList = container.querySelector('.conversation-list');
        const singleGroup = document.createElement('div');

        singleGroup.className = 'conversation-item';

        singleGroup.innerHTML = `
        <div class="avatar">
            ${group.groupName.charAt(0).toUpperCase()}
        </div>

        <div class="conversation-content">

            <div class="conversation-header">

                <h4>${group.groupName}</h4>

            </div>

            <p class="last-message">
                ${group.lastMessage || ''}
            </p>

        </div>
        `;
        singleGroup.addEventListener('click', () => {
            document.querySelectorAll('.conversation-item').forEach(li => {
                li.classList.remove('active');
            });
            singleGroup.classList.add('active');
            // console.log(group.conversationId,'sidebar group id');
            onSelectedUser(group.conversationId, null, true, group.groupName);
        });
        conversationList.appendChild(singleGroup);
    }

    const noUserFoundDiv = document.createElement('div');
    const noUserFoundPara = document.createElement('p');
    noUserFoundDiv.id = 'not-found';
    noUserFoundPara.textContent = 'No such user found';
    noUserFoundDiv.appendChild(noUserFoundPara);

    const searchBox = container.querySelector('.search-box');
    const searchInput = container.querySelector('#search-user');
    searchInput.addEventListener('input', (e) => {

        if (users.length === 0 || groupArr.length === 0) return;
        const listName = e.target.value.toLowerCase().trim();

        const conversationList = container.querySelector('.conversation-list');
        conversationList.innerHTML = '';

        if (container.contains(noUserFoundDiv)) {
            noUserFoundDiv.remove();
        }

        if (listName === '') {
            renderAllUsers();
            return;
        }
        const filterUser = users.filter(item => {
            return item.name.toLowerCase().includes(listName);
        });
        const filterGroup = groupArr.filter(item => {
            return item.groupName.toLowerCase().includes(listName);
        });
        if (filterUser.length === 0 && filterGroup.length === 0) {


            searchBox.appendChild(noUserFoundDiv);

            return;
        }

        renderAllUsers(filterUser, filterGroup);
    });
    // socket.off('updateSidebar');
    // socket.off('receiveGroup-message');
    socket.on('updateSidebar', (msg) => {
        console.log('SIDEBAR RECEIVED', msg);
        let user = users.find(
            u => Number(u.conversationId) === Number(msg.conversationId)
        );
        if (!user) {
            user = users.find(u => Number(u.id) === Number(msg.senderId));
            // Now update their conversationId too so future matches work
            if (user) {
                user.conversationId = msg.conversationId;
            }
    }
        if (user) {
            user.lastMessage = msg.text;
            renderAllUsers();
        }
        else{
            loadUser();

        }
    });
    socket.on('updateGroupSidebar',(msg)=>{
          let group = users.find(
            u => Number(u.conversationId) === Number(msg.conversationId)
        );
        if (group) {
            group.lastMessage = msg.text;
            renderAllUsers();
        }
        else{
            loadUser();
        }
    });
    loadUser();
    return container;
}