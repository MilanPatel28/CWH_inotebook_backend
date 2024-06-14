const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new note using: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // destructure the note to get only title, description and tag from req.body
      const { title, description, tag } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // this will return an array of errors
      }

      const note = await Notes.create({
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.send(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote". Login required

// for updation we use PUT request, because we are updating the existing data. PUT request is used to update the data and POST request is used to create a new data. So, we use PUT request here

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // create a newNote object
    const newNote = {};
    // check if title, description, tag is present in req.body, if yes then add it to newNote object
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated and update it
    let note = await Notes.findById(req.params.id); // req.params.id is the id of the note to be updated, which is passed in the url, (:id as per the url)
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // allow updation only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote". Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // find the note to be deleted and delete it, we need the id of the note to be deleted
    let note = await Notes.findById(req.params.id); // req.params.id is the id of the note to be deleted, which is passed in the url, (:id as per the url)
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // a suggestion from the instructor (metabob) to use the following code instead of the above code
    // allow deletion only if user owns this note
    // if (!note.user || typeof note.user !== "object" || !req.user.id || typeof req.user.id !== "string" || note.user.toString() !== req.user.id) {
    //     return res.status(401).send("Not Allowed");
    // }

    note = await Notes.findByIdAndDelete(req.params.id);

    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
