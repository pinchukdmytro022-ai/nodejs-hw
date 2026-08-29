import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page, perPage, tag, search } = req.query;

  const filter = {};

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * perPage;

  const [notes, totalNotes] = await Promise.all([
    Note.find(filter).skip(skip).limit(perPage),
    Note.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);

  res.status(201).json(newNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updateNote = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
  });

  if (!updateNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updateNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deleteNote = await Note.findByIdAndDelete(noteId);

  if (!deleteNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deleteNote);
};
