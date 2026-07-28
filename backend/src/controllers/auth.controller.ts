import { Request, Response } from 'express';

export const login = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
