import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const filter = { userId: req.user._id };
    if (tag) filter.tag = tag;
    if (search && String(search).trim() !== '') {
      filter.$text = { $search: String(search) };
    }

    const totalNotes = await Note.countDocuments(filter);

    let query = Note.find(filter);
    if (filter.$text) {
      query = query
        .select({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const notes = await query.skip((page - 1) * perPage).limit(Number(perPage));

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
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user._id,
    });
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = new Note({ ...req.body, userId: req.user._id });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedNote) throw createHttpError(404, 'Note not found');
    res.status(200).json(updatedNote);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id,
    });
    if (!deletedNote) throw createHttpError(404, 'Note not found');
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};
