import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response): void => {
  res.json({
    success: true,
    message: 'Backend is running',
  });
};
