import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { addNotes, deleteNote, editNote, getAllNotes, searchNote, updateNotePinned } from '../controller/notes.controller.js'


const  router=express.Router()
router.post("/add-note",verifyToken,addNotes)
router.post("/edit/:noteId", verifyToken, editNote)
router.get("/all", verifyToken, getAllNotes)
router.delete("/delete/:noteId", verifyToken, deleteNote)
router.put("/update-notepinned/:noteId", verifyToken, updateNotePinned)
router.get("/search",verifyToken,searchNote)


export default router