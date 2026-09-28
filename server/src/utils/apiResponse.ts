import { Response } from 'express';
import { ApiSuccessResponse } from '../types';

export function sendSuccess<T>(res: Response, statusCode: number, data: T): Response {
  const body: ApiSuccessResponse<T> = { success: true, data };
  return res.status(statusCode).json(body);
}