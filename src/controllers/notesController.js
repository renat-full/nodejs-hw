import { Note } from '../models/note.js';
import createError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const tag = req.query.tag;
    const search = req.query.search;

    let queryFilter = {};
    if (tag) queryFilter.tag = tag;
    if (search) queryFilter.$text = { $search: search };

    const query = Note.find(queryFilter)
      .skip((page - 1) * perPage)
      .limit(perPage);

    const [notes, totalNotes] = await Promise.all([
      query.exec(),
      Note.countDocuments(queryFilter),
    ]);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPage),
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) throw createError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = new Note(req.body);
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(createError(400, err.message));
    }
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.noteId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedNote) throw createError(404, 'Note not found');

    res.status(200).json(updatedNote);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(createError(400, err.message));
    }
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.noteId);
    if (!deletedNote) throw createError(404, 'Note not found');
    res.status(200).json(deletedNote);
  } catch (err) {
    next(err);
  }
};
