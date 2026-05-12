const User = require('../Model/signupSchema');
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
    
        if(!user){
            return res.status(404).json({
                message:'Invalid credentials',
                success:false,
            });
        }
        const hashedPassword = await bcrypt.compare(password,user.password);
        if(!hashedPassword){
            return res.status(401).json({ 
                message: 'Invalid credentials', 
                success:false, 
            });
        }
        res.status(200).json({ message: 'Login successful', success:true});
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }    
}
module.exports = {
    login
}