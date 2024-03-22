const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// 1. Route to get all notes of the logged-in user using GET method /api/notes/fetchallnotes. Login required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        // Fetch all notes of the logged-in user
        const fetchNotes = await Notes.find({ user: req.user.id });
        res.json(fetchNotes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// 2. Route to post a new note for the logged-in user using POST method /api/notes/postnotes. Login required.
router.post('/postnotes', fetchuser, [
    // Validate title field
    body('title').isLength({ min: 5 }).withMessage("Title must be at least 5 characters"),
    // Validate description field
    body('description').isLength({ min: 6 }).withMessage("Description must be at least 6 characters"),
    // Validate tag field
    body('tag').isLength({ min: 6 }).withMessage("Tag must be at least 6 characters"),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new note object
        const notes = new Notes({
            title, description, tag, user: req.user.id
        });

        // Save the new note to the database
        const saveNotes = await notes.save();
        res.json(saveNotes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
