import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import type { UserResponseDTO } from "../modules/users/validation/user.schema.js";
import { logger } from "./logger.js";

export type RefreshTokenPayload = JwtPayload & {
  id: string;
  email: string;
  name: string;
};

// type SafeUser = Pick<UserResponseDTO, "id" | "name" | "email">;

export class TokenService {
  async generateTokens(user: any) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    logger.info(payload, "payloads");
    //
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expire,
    });

    const refreshToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpire,
    });

    return { accessToken, refreshToken };
  }

  async sanitizeUser(
    user: UserResponseDTO,
  ): Promise<Omit<UserResponseDTO, "password">> {
    const { password, ...rest } = user as UserResponseDTO;
    return rest;
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<Omit<UserResponseDTO, "password"> | null> {
    const decoded = jwt.verify(token, config.jwt.secret);

    // runtime guard
    if (typeof decoded === "string") return null;

    const payload = decoded as RefreshTokenPayload;

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
  }
}
