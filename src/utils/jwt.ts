import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import type { UserResponseDTO } from "../modules/users/validation/user.schema.js";

export type RefreshTokenPayload = JwtPayload & {
  userId: string;
  sessionId: string;
};

// type SafeUser = Pick<UserResponseDTO, "id" | "name" | "email">;

type UserTokenPayload = {
  userId: string;
  sessionId: string;
};

export class TokenService {
  async generateTokens(user: UserTokenPayload) {
    const accessToken = jwt.sign(user, config.jwt.secret, {
      expiresIn: Number(config.jwt.expire),
    });

    const refreshToken = jwt.sign(user, config.jwt.secret, {
      expiresIn: Number(config.jwt.refreshExpire),
    });

    return { accessToken, refreshToken };
  }

  async sanitizeUser(
    user: UserResponseDTO,
  ): Promise<Omit<UserResponseDTO, "password">> {
    const { password, ...rest } = user as UserResponseDTO;
    return rest;
  }

  async verifyRefreshToken(token: string): Promise<UserTokenPayload | null> {
    const decoded = jwt.verify(token, config.jwt.secret);

    // runtime guard
    if (typeof decoded === "string") return null;

    const payload = decoded as RefreshTokenPayload;

    return {
      userId: payload.id,
      sessionId: payload.sessionId,
    };
  }
}
