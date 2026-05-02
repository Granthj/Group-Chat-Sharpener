const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        
        let user;
        if(username.includes('@')) {
            
            user = await User.findOne({
                where:{
                    email: username
                }
            });
        }
        else{
            user = await User.findOne({
                where:{
                    phone: username
                }
            });
        }
        const hashedPassword = await bcrypt.compare(password,user.password);
        if(!hashedPassword){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user: user });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }    
}
module.exports = {
    login
}