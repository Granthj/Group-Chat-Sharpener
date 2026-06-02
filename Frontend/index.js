import {Signup} from './Pages/Signup.js';
import {Login} from './Pages/Login.js';
// import {ChatWindow} from './Component/ChatWindow.js';
import { ChatPage } from './Pages/ChatPage.js';

const app = document.getElementById('app');
console.log('working');
function render(route){
    
    app.innerHTML = "";
    switch(route){
        case "/login":
            app.appendChild(Login(navigate));
            break;
            case "/signup":
                app.appendChild(Signup(navigate));
                console.log('working signup');
            break;
        case "/chat":
            app.appendChild(ChatPage(navigate));
            break;    
        default:
            app.innerHTML = "<h2>404 page not found</h2>"
    }
}
export function navigate(route){
    window.history.pushState({},"",route);
    render(route);
}
window.addEventListener("popstate",()=>{
    render(window.location.pathname);
});
function init(){

    const currentRoute = window.location.pathname;
    render(currentRoute);
}
init();