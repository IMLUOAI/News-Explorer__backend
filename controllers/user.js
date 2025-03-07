
const NotFoundError = require('../errors/NotFoundError');
const BadInternalError = require('../errors/BadInternalError');
const DuplicatedMongodbError = require('../errors/DuplicatedMongodbError');
const ForbidenError = require('../errors/ForbidenError')
const UnauthorizedError = require('../errors/UnauthorizedError');

// Get all users
modules.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a single user by ID
modules.exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new user
modules.exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPadate an existing user
modules.exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//login a user

modules.exports.loginUser = async (req, res) => {    
    try {
        const { email, password } = req.body;
        const user = await User.findUserByCredentials(email, password);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};  

//compare this snippet from controllers/user.js:
//     try {
//         const user = await User.findUserByCredentials(email, password);      
//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//         res.status(200).json({ token });                     
