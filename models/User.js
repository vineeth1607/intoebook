// User model (models/User.js)
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },number: {
        type: String, // Changed type to String
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^\d{10}$/.test(value); // Validate 10 numeric digits
            },
            message: props => `${props.value} is not a valid number! Must be 10 numeric digits.`
        }
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model("User", UserSchema);

module.exports = User;