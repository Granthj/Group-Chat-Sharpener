const bcrypt = require('bcrypt');
const signup = async (req, res) => {

    try{
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            where:{
                email: email,
                phone: phone
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password,10);
            
        const newUser = new User.create({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    signup
};