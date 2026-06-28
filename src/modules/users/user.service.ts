import bcrypt from "bcryptjs";
import { UserRepository } from "./repositories/user.repository.js";
import type { LoginDTO } from "./validation/login.schema.js";
import type { UserDTO } from "./validation/user.schema.js";

import crypto from "crypto";
import {
  ApplicationError,
  ConflictError,
  NotFoundError,
} from "../../middleware/error-handler.js";
import { generateToken } from "../../utils/generate-token.js";
import { TokenService } from "../../utils/jwt.js";
import type { sessionRepo } from "../sessions/Repositories/session.repository.js";

export class UserService {
  constructor(
    private userRepo: UserRepository,
    private tokenService: TokenService,
    private sessionRepo: sessionRepo,
  ) {}

  async register(data: UserDTO) {
    try {
      const isEmailExists = await this.userRepo.findByEmail(data.email);

      console.log(isEmailExists);
      if (isEmailExists) {
        throw new Error("Email exits, try diff one");
      }

      // user exists
      const isNameTaken = await this.userRepo.findByUserName(data.name);
      if (isNameTaken) {
        throw new Error("User name is taken");
      }

      const password = await bcrypt.hash(data.password, 10);

      const { token, hash } = generateToken();

      const user = await this.userRepo.create({
        name: data.name,
        email: data.email,
        password,
        emailToken: hash,
        emailTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 min
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailToken: user.emailToken,
        emailTokenExpiresAt: user.emailTokenExpiresAt,
      };
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async login(data: LoginDTO) {
    try {
      const { email, password } = data;
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new Error("Invalid Credentials");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      const safeUser = await this.tokenService.sanitizeUser(user);

      const session = await this.sessionRepo.create({
        userId: safeUser.id,
        isValid: true,
      });

      // generate tokens using session.id
      const tokens = await this.tokenService.generateTokens({
        userId: safeUser.id,
        sessionId: session.id,
      });

      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 12);

      await this.sessionRepo.update(session.id, {
        refreshToken: hashedRefreshToken,
      });

      return {
        user: safeUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async refreshToken(token: string) {
    try {
      const decoded = await this.tokenService.verifyRefreshToken(token);

      if (!decoded) {
        throw new Error("Not Verified");
      }

      const session = await this.sessionRepo.findBySessionId(decoded.sessionId);
      if (!session) {
        throw new Error("Invalid session");
      }

      const newTokens = await this.tokenService.generateTokens({
        userId: decoded.userId,
        sessionId: decoded.sessionId,
      });
      return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      };
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async verifyEmail(token: string) {
    const isUser = await this.userRepo.findByEmailToken(token);
    if (!isUser) {
      throw new Error("Invalid token");
    }

    if (isUser.emailTokenExpiresAt && isUser.emailTokenExpiresAt < new Date()) {
      throw new Error("Token is expired, try again");
    }

    await this.userRepo.update(isUser.id, {
      isVerified: true,
      emailToken: null,
      emailTokenExpiresAt: null,
    });
  }

  async resendVerification(email: string) {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        return;
      }
      if (user.isVerified) {
        return;
      }

      if (user.emailTokenExpiresAt) {
        const expire = Date.now() - user.emailTokenExpiresAt.getTime();
        if (expire > 60_000) {
          return;
        }
      }

      const { token, hash } = generateToken();
      await this.userRepo.update(user.id, {
        emailToken: hash,
        emailTokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
      });
      await this.sendVerificationEmail(email, token);
    } catch (error) {
      throw new ApplicationError(String(error));
    }
  }

  private async sendVerificationEmail(email: string, token: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("user is not registered in this system");
    }
    const link = `${process.env.CLIENT_URL}/verify/${token}`;

    // resend
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        return;
      }

      const { token, hash } = generateToken();

      await this.userRepo.update(user.id, {
        passwordRestToken: hash,
        passwordRestTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
      const response = await this.sendPasswordReset(email, token);
      return response;
    } catch (error) {}
  }
  private async sendPasswordReset(email: string, token: string) {
    try {
      const link = `${process.env.CLIENT_URL}/forgot-password/${token}`;
      // resend mail
    } catch (error) {}
  }
  async resetPassword(token: string, password: string) {
    try {
      const hash = crypto.createHash("sha256").update(token).digest("hex");

      const user = await this.userRepo.findByPassportToken(hash);

      if (!user) {
        throw new ConflictError("Token is not valid");
      }

      if (user.passwordRestTokenExpiresAt) {
        const isExpire = Date.now() < user.passwordRestTokenExpiresAt.getTime();
        if (isExpire) {
          return;
        }
      }
      const passwordHash = await bcrypt.hash(password, 12);

      await this.userRepo.update(user.id, {
        password: passwordHash,
      });
    } catch (error) {}
  }

  async changePassword(
    userId: string,
    sessionId: string,
    oldpassword: string,
    newpassword: string,
  ) {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new NotFoundError("User not found");
      }
      const isMatch = bcrypt.compare(oldpassword, user.password);

      if (!isMatch) {
        throw new ConflictError("Current password is incorrect");
      }

      const hashPassword = await bcrypt.hash(newpassword, 10);

      await this.userRepo.update(userId, {
        password: hashPassword,
      });

      await this.sessionRepo.invalidateOther(userId, sessionId);
      const { accessToken } = await this.tokenService.generateTokens({
        userId: user.id,
        sessionId: sessionId,
      });

      return { accessToken };
    } catch (error) {}
  }
}
