import { Request, Response } from 'express';

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
