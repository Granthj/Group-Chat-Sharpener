import { API_URL } from "../Src/Config.js";
export function Signup(navigate){
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="container-div">
        <form method="post">
        <h2>Sign Up</h2>
            <div id="nameDiv">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
            </div>
            <div id="emailDiv">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email">
            </div>
            <div id="phoneDiv">
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone">
            </div>

            <div id="passwordDiv">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password">
            </div>
            <button type="submit" id="button">Sign Up</button>
            <br>
            <a href="/login" id="login-link">Already registered? Click login here</a>
        </form>
    </div>
    `;

    const form = container.querySelector('form');
    const inputEmail = container.querySelector('#email');
    const inputPhone = container.querySelector('#phone');

    form.addEventListener('submit',async (e)=>{
        e.preventDefault();
        
        try{
            const name = e.target.name.value;
            const email = e.target.email.value;
            const phone = e.target.phone.value;
            const password = e.target.password.value;

            console.log(name,email,phone,password);
            const res = await axios.post(`${API_URL}/signup`,{
                name,
                email,
                phone,
                password
            });
            // console.log(res.config.data);
            if(res.status === 201){
                navigate('/login');
               
            }
        }
        catch(err){

            if(err.response){
                const errors = err.response.data.errors;
                // if(emailExists){
                //     emailExists.remove();
                // }
                // if(phoneExists){
                //     phoneExists.remove();
                // }

                document.querySelectorAll('.alert').forEach(element=>element.remove());

                if(errors.email){
                    const p = document.createElement('p');
                    p.className = 'alert';
                    p.textContent = err.response.data.errors.email;
                    inputEmail.insertAdjacentElement('afterend', p);
                }
                if(errors.phone){
                    const p = document.createElement('p');
                    p.className = 'alert';
                    p.textContent = err.response.data.errors.phone;
                    phone.insertAdjacentElement('afterend', p);
                }
            }
        }
    });
    function cleanError(input){
        input.addEventListener('input',()=>{
            const err = input.parentElement.querySelector(".alert");
            if(err){
                err.remove();
            }
        });
    }
    cleanError(inputEmail);
    cleanError(inputPhone);

    return container;
}