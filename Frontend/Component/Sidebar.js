import { API_URL } from '../Src/Config.js';
import { CreateGroup } from './CreateGroup.js';
export function Sidebar({ onSelectedUser }) {

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
            <div id="groupDiv">
                <button id="btnGroup">Create Group</button>
            </div>
            </div>
            
            <div class="conversation-list"></div>
            `;

    let addSubmitBtn;
    let isGroup = false;
    let selectedUserIdArr = [];
    let groupArr = [];
    let users = [];
    async function loadUser() {

        try {
            const response = await axios.get(`${API_URL}/get-all-users`);

            users = response.data.users;
            groupArr = response.data.group

            renderAllUsers();
            // response.data.users.forEach(user => {
            //     renderUser(user);
            // })
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
    function renderAllUsers(userList = users) {
        const conversationList = container.querySelector('.conversation-list');
        conversationList.innerHTML = '';

        userList.forEach(user => {
            renderUser(user);
        });
        groupArr.forEach(grp => {
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
            addSubmitBtn.textContent = 'Create Group';
            addSubmitBtn.addEventListener('click', () => {
                const modal = CreateGroup(selectedUserIdArr);
                document.body.appendChild(modal);
            });
        }
        groupDiv.appendChild(addSubmitBtn);
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
            onSelectedUser(user.conversationId, user.id,false);
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
        singleGroup.addEventListener('click',()=>{
            document.querySelectorAll('.conversation-item').forEach(li=>{
                li.classList.remove('active');
            });
            singleGroup.classList.add('active');
            onSelectedUser(group.conversationId,null,true);
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

        if (users.length === 0) return;
        const user = e.target.value.toLowerCase().trim();

        const conversationList = container.querySelector('.conversation-list');
        conversationList.innerHTML = '';

        if (container.contains(noUserFoundDiv)) {
            noUserFoundDiv.remove();
        }

        if (user === '') {
            // users.forEach(li => {
            //     renderUser(li);
            // });
            renderAllUsers();
            return;
        }
        const filterUser = users.filter(item => {
            return item.name.toLowerCase().includes(user);
        });
        if (filterUser.length === 0) {


            searchBox.appendChild(noUserFoundDiv);

            return;
        }

        // filterUser.forEach(li => {
        //     renderUser(li);
        // });
        renderAllUsers(filterUser);
    });

    loadUser();
    return container;
}