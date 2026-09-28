import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { env } from '../config/env';
import { DemoAuthInput } from '../validators/auth.validator';
import { AuthTokenPayload } from '../types';

const DEFAULT_DEMO_EMAIL = 'demo@feedants.com';
const DEFAULT_DEMO_NAME = 'Demo User';

function issueToken(user: IUser): string {
  const payload: AuthTokenPayload = { userId: user._id.toString(), email: user.email };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export async function demoAuth(input: DemoAuthInput): Promise<{ user: IUser; token: string }> {
  const email = (input.email ?? DEFAULT_DEMO_EMAIL).toLowerCase().trim();
  const name = input.name ?? DEFAULT_DEMO_NAME;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ name, email });
  }

  const token = issueToken(user);
  return { user, token };
}