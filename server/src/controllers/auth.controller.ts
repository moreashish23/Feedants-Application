import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { demoAuthSchema } from '../validators/auth.validator';
import { demoAuth } from '../services/auth.service';

export const postDemoAuth = asyncHandler(async (req: Request, res: Response) => {
  const input = demoAuthSchema.parse(req.body ?? {});
  const { user, token } = await demoAuth(input);

  sendSuccess(res, 200, {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
});