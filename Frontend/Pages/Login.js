import { API_URL } from "../Src/Config.js";
export function Login(navigate) {
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="container-div">
            <form method=post>
                <h2>Login</h2>
                <div id="emailDiv">
                    <label for="username">Email or Phone:</label>
                    <input type="username" id="username" name="username" placeholder="Write email or phonenumber">
                </div>

                <div id="passwordDiv">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password">
                </div>

                <button type="submit" id="button">Login</button>
                <br>
                    <a href="/signup" id="signup-link">Not registered yet? Click sign-up here</a>
                <br>
                <a href="/password" id="forgot-password-link">forgot-password?</a>
            </form>
        </div>
    `;
    
    const form = container.querySelector('form');
    const inputUsername = container.querySelector('#username');
    const inputPassword = container.querySelector('#password');
    const errorExists = document.createElement('p');
    errorExists.className = 'alert';

    function cleanError(inputTag){

        inputTag.addEventListener('input',()=>{
            errorExists.remove();
        })
        
    }
    cleanError(inputUsername);
    cleanError(inputPassword);
    
    form.addEventListener('submit',async (e)=>{

        try{
            e.preventDefault();
            
            const username = e.target.username.value;
            const password = e.target.password.value;
            
            const res = await axios.post(`${API_URL}/login`,{
                username,
                password
            });
            
            if(res.data.success){
                localStorage.setItem('token',res.data.token);
                alert('Login successfully');
                navigate('/dashboard');
            }
            
        }
        catch(err){
            if(err.response && !err.response.data.success){
                
                errorExists.remove();
                errorExists.textContent = err.reponse.data.message;
                form.appendChild(errorExists);
                

            }
        }
    })
    return container;
}