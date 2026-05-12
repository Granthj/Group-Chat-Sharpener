import {Signup} from './Component/Signup.js';
import {Login} from './Component/Login.js';
import {ChatWindow} from './Component/ChatWindow.js';

const app = document.getElementById('app');
app.innerHTML = "";
console.log('working');
function render(route){

    switch(route){
        case "/login":
            app.appendChild(Login(navigate));
            console.log('working login');
            break;
        case "/signup":
            app.appendChild(Signup(navigate));
            break;
        case "/chat":
            app.appendChild(ChatWindow(navigate));
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