import { Note } from '../models/note.js';
import createError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    let query = Note.find();

    if (tag) {
      query = query.where('tag').equals(tag);
    }

    if (search) {
      query = query.where('$text').equals({ $search: search });
    }

    query = query.skip((page - 1) * perPage).limit(Number(perPage));

    const [notes, totalNotes] = await Promise.all([
      query.exec(),
      Note.countDocuments(query.getFilter()),
    ]);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
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
