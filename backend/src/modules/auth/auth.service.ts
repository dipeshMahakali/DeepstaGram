import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { ApiError } from '../../shared/utils/apiError';
import { RegisterInput, LoginInput } from './auth.schema';

export class AuthService {
  private generateTokens(user: { id: string; email: string; username: string }) {
    const accessOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
    const refreshOptions: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] };

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      env.JWT_SECRET,
      accessOptions
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      env.JWT_REFRESH_SECRET,
      refreshOptions
    );

    return { accessToken, refreshToken };
  }

  async register(input: RegisterInput, userAgent?: string, ipAddress?: string) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input.email.toLowerCase() },
          { username: input.username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === input.email.toLowerCase()) {
        throw ApiError.conflict('An account with this email already exists.', 'EMAIL_TAKEN');
      }
      throw ApiError.conflict('This username is already taken.', 'USERNAME_TAKEN');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase().trim(),
        username: input.username.toLowerCase().trim(),
        name: input.name.trim(),
        passwordHash,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=FF3B70&color=fff`,
      },
    });

    const tokens = this.generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    const identifier = input.identifier.toLowerCase().trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid username/email or password.', 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid username/email or password.', 'INVALID_CREDENTIALS');
    }

    const tokens = this.generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };

      const session = await prisma.session.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw ApiError.unauthorized('Refresh token is expired or revoked.', 'INVALID_REFRESH_TOKEN');
      }

      const tokens = this.generateTokens(session.user);

      await prisma.session.update({
        where: { id: session.id },
        data: { token: tokens.refreshToken },
      });

      const { passwordHash: _, ...safeUser } = session.user;
      return { user: safeUser, tokens };
    } catch (err) {
      throw ApiError.unauthorized('Invalid refresh token.');
    }
  }

  async logout(userId: string, token?: string) {
    if (token) {
      await prisma.session.deleteMany({
        where: { userId, token },
      });
    } else {
      await prisma.session.deleteMany({
        where: { userId },
      });
    }
    return true;
  }
}

export const authService = new AuthService();
