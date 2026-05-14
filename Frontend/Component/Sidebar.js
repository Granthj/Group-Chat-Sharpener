import { API_URL } from '../Src/Config.js';
export function Sidebar({onSelectedUser}){

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

    let users = [];
    async function loadUser(){

        try{
            const response = await axios.get(`${API_URL}/get-all-users`);

            users = response.data.users;
            const conversationList = container.querySelector('.conversation-list');
            conversationList.innerHTML = '';

            response.data.users.forEach(user=>{
                renderUser(user);
            })
        }
        catch(err){
            if(!err.response.data || !err.response){
                const sidebarTitle = container.querySelector('.sidebar-title');
                const no_user = document.createElement('p');
                no_user.textContent = 'No user';

                sidebarTitle.appendChild(no_user);
            }
        }
    } 
    function renderUser(user){

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
                        ${user.time}
                    </span>

                </div>

                <p class="last-message">
                    ${user.lastMessage}
                </p>

            </div>

        `;
        singleUser.addEventListener('click',()=>{
            document.querySelectorAll('.conversation-item').forEach(li=>{
                li.classList.remove('active');
            });
            singleUser.classList.add('active');
            onSelectedUser(user);
        });
        conversationList.appendChild(singleUser);
    }

    const noUserFoundDiv = document.createElement('div');
    const noUserFoundPara = document.createElement('p');
    noUserFoundDiv.id = 'not-found';
    noUserFoundPara.textContent = 'No such user found';
    noUserFoundDiv.appendChild(noUserFoundPara);

    const searchBox = container.querySelector('.search-box');
    const searchInput = container.querySelector('#search-user');
    searchInput.addEventListener('input',(e)=>{

        if(users.length === 0) return;
        const user = e.target.value.toLowerCase().trim();
        const conversationList = container.querySelector('.conversation-list');
        conversationList.innerHTML = '';

        if(container.contains(noUserFoundDiv)){
            noUserFoundDiv.remove();
        }

        if(user === ''){
            users.forEach(li=>{
                renderUser(li);
            });
            return;
        }
        const filterUser = users.filter(item=>{
            return item.name.toLowerCase().includes(user);
        });
        if(filterUser.length === 0){
            
            
            searchBox.appendChild(noUserFoundDiv);

            return;
        }

        filterUser.forEach(li=>{
            renderUser(li);
        });
    });

    loadUser();
    return container;
}