const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

// Global variable
const secretCode = "sign@Vineeth"

// Validation middleware for user data
const validateUserData = [
    // Validate name field
    body('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),

    // Validate email field
    body('email').isEmail().withMessage("Enter a valid email"),

    // Validate password field
    body('password').isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).*$/)
        .withMessage("Password must contain at least one special character, one capital letter, and one numeric digit"),

    // Validate number field
    body('number').isLength({ min: 10, max: 10 }).withMessage("Number must be exactly 10 digits")
        .isNumeric().withMessage("Number must contain only digits")
];

// 1.Route for creating a new user using POST "api/authentication/createuser". No login required 
router.post('/createuser', validateUserData, async (req, res) => {
    try {
        // Check if validation errors exist
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract name, email, number, and password from request body
        const { name, email, number, password } = req.body;

        // Check if user with email or number already exists
        const existingUser = await User.findOne({ $or: [{ email }, { number }] });
        if (existingUser) {
            if (existingUser.email === email) {
                // Return error if user with same email already exists
                return res.status(400).json({ error: 'Sorry, a user already exists with this email' });
            } else {
                // Return error if user with same number already exists
                return res.status(400).json({ error: 'Sorry, a user already exists with this number' });
            }
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with hashed password
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            number,
        });

        const payLoad = { user: { id: user.id } }
        const authenticationToken = jwt.sign(payLoad, secretCode);

        // Respond with the newly created user
        res.status(201).json({ message: "User has been created succesfully", authenticationToken });
    } catch (error) {
        // Handle any errors that occur during user creation
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2.Route for user login using POST "api/authentication/login"
router.post("/login", async (req, res) => {
    try {
        const { email, number, password } = req.body;
        // Check if user with email or number and password matches
        const authenticateUser = await User.findOne({ $or: [{ email }, { number }] });
        if (!authenticateUser) {
            return res.status(404).json({ error: 'Invalid credentials' });
        }
        const matchPassword = await bcrypt.compare(password, authenticateUser.password);
        if (!matchPassword) {
            return res.status(404).json({ error: "Invalid credentials" });
        }

        // If user and password are correct, create authentication token
        const payLoad = { user: { id: authenticateUser.id } }
        const authenticationToken = jwt.sign(payLoad, secretCode);
        // Respond with user login 
        res.status(200).json({ message: "Login successful", authenticationToken });
    } catch (error) {
        // Handle any errors that occur during user login
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
// 3.Route to get logged in user details using JWT and POST method /api/authentication/userdetails. login rquired
router.post("/userdetails", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})
module.exports = router;













// const express = require('express');
// const User = require('../models/User');
// const { body, validationResult } = require('express-validator');
// const router = express.Router();

// router.post('/', [
//     body('name', "Name must be at least 5 characters").isLength({ min: 5 }),
//     body('email', "Enter a valid email").isEmail(),
//     body('password', "Password must be at least 6 characters and contain at least one special character, one capital letter, and one numeric digit")
//         .isLength({ min: 6 })
//         .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).*$/),
//         body('number', "Number must be exactly 10 digits").trim().isLength({ exact: 10 }).withMessage('Number must be 10 digits').isNumeric().withMessage('Number must contain only digits')

// ], async (req, res) => {
//     try {
//         // Extract validation errors, if any
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         // Check if email already exists
//         const existingEmailUser = await User.findOne({ email: req.body.email });
//         if (existingEmailUser) {
//             return res.status(400).json({ error: 'Email already registered' });
//         }

//         // Check if number already exists
//         const existingNumberUser = await User.findOne({ number: req.body.number });
//         if (existingNumberUser) {
//             return res.status(400).json({ error: 'Number already registered' });
//         }

//           // Ensure number has exactly 10 digits
//           if (req.body.number.length !== 10) {
//             return res.status(400).json({ error: 'Number must be exactly 10 digits' });
//         }

//         // Create a new user
//         const newUser = await User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//             number: req.body.number,
//         });

//         // Respond with the newly created user
//         res.status(201).json(newUser);
//     } catch (error) {
//         // Handle any errors that occur during the user creation process
//         console.error('Error creating user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }

//     // created a user using POST "/pai/authentication". it doesn't require authenticatication
//     //  const user = User(req.body);
//     //  user.save();
//     //  console.log(req.body)
//     // res.send(req.body);
// });

// module.exports = router;