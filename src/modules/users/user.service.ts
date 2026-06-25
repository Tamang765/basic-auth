import bcrypt from "bcryptjs";
import { UserRepository } from "./repositories/user.repository.js";
import type { LoginDTO } from "./validation/login.schema.js";
import type { UserDTO } from "./validation/user.schema.js";

import { generateToken } from "../../utils/generate-token.js";
import { TokenService } from "../../utils/jwt.js";
import { logger } from "../../utils/logger.js";
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
      throw new Error(error);
    }
  }

  async login(data: LoginDTO) {
    try {
      const { email, password } = data;
      const user = await this.userRepo.findByEmail(email);
      console.log(user);
      if (!user) {
        throw new Error("Invalid Credentials");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      const token = await this.tokenService.generateTokens(user);

      const newUser = await this.tokenService.sanitizeUser(user);
      const hashedRefreshToken = await bcrypt.hash(token.refreshToken, 12);

      const refactoredUserData = {
        userId: newUser.id,
        refreshToken: hashedRefreshToken,
        isValid: true,
      };
      await this.sessionRepo.create(refactoredUserData);
      return {
        user: newUser,
        token,
      };
    } catch (error) {
      logger.error(error, "error login");
      throw new Error(error);
    }
  }

  async refreshToken(token: string) {
    try {
      const decoded = await this.tokenService.verifyRefreshToken(token);

      console.log(decoded, "kxa");
      if (!decoded) {
        throw new Error("Not Verified");
      }

      const sessionUser = await this.sessionRepo.findByUserId(decoded.id);
      console.log(sessionUser, "sessionUser");
      let validSession = null;
      for (const sessions of sessionUser) {
        console.log(token, sessions.refreshToken, "asd");
        const match = await bcrypt.compare(token, sessions.refreshToken);
        if (match) {
          validSession = sessions;
          break;
        }
      }

      if (!validSession) {
        throw new Error("Invalid Refresh Token");
      }

      const newToken = await this.tokenService.generateTokens(decoded);
      return {
        accessToken: newToken.accessToken,
        refreshToken: newToken.refreshToken,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifyEmail(token: string) {
    // const { hash } = generateToken();

    // console.log(hash);
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
}
