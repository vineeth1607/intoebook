
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Validation middleware
const validateUserData = [
    body('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    body('email').isEmail().withMessage("Enter a valid email"),
    body('password').isLength({ min: 8}).withMessage("Password must be at least 6 characters").matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).*$/).withMessage("Password must contain at least one special character, one capital letter, and one numeric digit"),
    body('number').isLength({ min: 10, max: 10 }).withMessage("Number must be exactly 10 digits").isNumeric().withMessage("Number must contain only digits")
];

// Route for creating a new user
router.post('/', validateUserData, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, number } = req.body;

        // Check if email or number already exist
        const existingUser = await User.findOne({ $or: [{ email }, { number }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'Email already registered' });
            } else {
                return res.status(400).json({ error: 'Number already registered' });
            }
        }

        // Create a new user
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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