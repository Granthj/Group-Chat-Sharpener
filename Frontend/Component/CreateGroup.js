import { API_URL } from "../Src/Config.js";
export function CreateGroup(usersIdArr){

    const container = document.createElement('div');

    container.innerHTML = `

        <div>
        <form>
            <label for="groupname">Write your group name</label>
            <input id="groupname" type="text" name="groupName" placeholder="Group name here"></input>
            <button id="confirmBtn" type="submit">Confirm</button>
            <button id="cancelBtn" type="button">Cancel</button>

        </form>
        </div>

    `;
    const form = container.querySelector('form');
    const input = container.querySelector('#groupname');
    const confirmBtn = container.querySelector('#confirmBtn');
    const cancelBtn = container.querySelector('#cancelBtn');
    

    form.addEventListener('submit',SubmitForm);
    cancelBtn.addEventListener('click',()=>{
        container.remove();
    });
    
    async function SubmitForm(e){

        try{

            e.preventDefault();
            const userId = localStorage.getItem('userId');
            const objArr = [];
            for(const users of usersIdArr){
                let obj = {
                    isAdmin:false,
                    userId:users
                }
                objArr.push(obj);
            }
            let obj = {
                isAdmin:true,
                userId:userId
            }
            objArr.push(obj);
            const formValue = input.value.trim();
              if(!formValue){
                return;
            }
            const res = await axios.post(`${API_URL}`,{
                groupName:formValue,
                users:objArr
            });

            container.remove();
        }
        catch(err){
            console.log('something wrong',err);
        }
    }

    return container;
}