const User = require('../Model/signupSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (user)=>{
    const token = jwt.sign({
        data:user
    },
    'chat-user',{expiresIn:'1h'}
    );
    return token;
}
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
        const newUser = {
            userId:userId,
            username:user.name,
            useremail:user.email
        }
        const token = generateToken(newUser);
        res.status(200).json({ message: 'Login successful', success:true,token:token,userId:newUser.userId});
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }    
}
module.exports = {
    login
}