/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();

var fetchuser = require("../middleware/fetchuser")
var Note = require('../models/Note')
const { check, validationResult } = require('express-validator');


//ROUTE 1: Get all the notes using: GET "api/notes/fetchallnotes". Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 2: Add the notes using: post "api/notes/addnote". Login required

router.post('/addnote', fetchuser, [

    check('title', 'Enter valid a title').isLength({ min: 3 }),
    check('description', 'Description must be 5 characters').isLength({ min: 5 })

], async (req, res) => {

    try {
        const { title, description, tag } = req.body;
        // Finds the validation errors in this request and wraps them in an object with handy functions

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const saveNotes = await note.save()
        res.json({ success: true, message: "Note Added", saveNotes })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server errors occurred")
    }


})

//ROUTE 2: Update an existing Note using: post "api/notes/updatenote/:id". Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body
        //create a newnote object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ success: true, message: "Note Updated Successfully", newNote })


    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server errors occurred")

    }

})

//ROUTE 2: Delete an existing Note using: post "api/notes/deletenote/:id". Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        //find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // allowed deletion if user own this notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: "Note has been deleted", note: note });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server errors occurred")
    }

})
module.exports = router 