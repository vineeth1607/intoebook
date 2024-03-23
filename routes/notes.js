const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// 1. Route to get all notes of the logged-in user using GET method "/api/notes/fetchallnotes". Login required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        // Fetch all notes of the logged-in user
        const fetchNotes = await Notes.find({ user: req.user.id });
        res.json({ message: "Notes fetched successfully", notes: fetchNotes });
    } catch (error) {
        console.error("Error fetching notes:", error.message);
        res.status(500).send("Internal server error");
    }
});

// 2. Route to post a new note for the logged-in user using POST method "/api/notes/postnotes". Login required.
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
        res.json({ message: "Note saved successfully", notes: saveNotes });
    } catch (error) {
        console.error("Error posting note:", error.message);
        res.status(500).send("Internal server error");
    }
});

// 3. Route to update an existing note using PUT method "/api/notes/updatenotes/:id". Login required.
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    const updatedNotes = {};

    if (title) { updatedNotes.title = title };
    if (description) { updatedNotes.description = description };
    if (tag) { updatedNotes.tag = tag };
    try {
        // Find the existing note and update it
        let userNote = await Notes.findById(req.params.id);
        if (!userNote) {
            return res.status(404).send("Note not found");
        }
        // Check if the user owns the note
        if (userNote.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized");
        }
        // Create new note object and save new note to database
        userNote = await Notes.findByIdAndUpdate(req.params.id, { $set: updatedNotes }, { new: true });
        res.json({ message: "Note updated successfully", notes: userNote });
    } catch (error) {
        console.error("Error updating note:", error.message);
        res.status(500).send("Internal server error");
    }
});

/// 4. Route to delete an existing note using DELETE method "/api/notes/deletenote/:id". Login required.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find existing note by ID
        let userNote = await Notes.findById(req.params.id);
        // Return if note not found
        if (!userNote) {
            return res.status(404).send("Note not found");
        }
        // Return if the user is not authorized
        if (userNote.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized");
        }
        // Delete the note and respond with deletion message and deleted note
        const deletedNote = await Notes.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted successfully", deletedNote });
    } catch (error) {
        console.error("Error deleting note:", error.message);
        res.status(500).send("Internal server error");
    }
});
module.exports = router;
//vineeth
