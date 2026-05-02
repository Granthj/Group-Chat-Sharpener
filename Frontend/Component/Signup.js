export function Signup(){
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="container-div">
        <form method="post">
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
        </form>
    </div>
    `;

    return container;
}