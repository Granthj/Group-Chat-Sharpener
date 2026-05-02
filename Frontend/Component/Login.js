export function Login() {
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="container-div">
            <form>
                <div id="emailDiv">
                    <label for="email">Email or Phone:</label>
                    <input type="email" id="email" name="email" placeholder="Write email or phonenumber">
                </div>

                <div id="passwordDiv">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password">
                </div>
            </form>
        </div>
    `;

    return container;
}