import bcrypt from "bcryptjs";
import { UserRepository } from "./repositories/user.repository.js";
import type { LoginDTO } from "./validation/login.schema.js";
import type { UserDTO, UserResponseDTO } from "./validation/user.schema.js";

import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import { logger } from "../../utils/logger.js";

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async register(data: UserDTO) {
    try {
      const isEmailExists = await this.userRepo.findByEmail(data.email);

      if (isEmailExists) {
        throw new Error("Email exits, try diff one");
      }

      // user exists
      const isNameTaken = await this.userRepo.findByUserName(data.name);
      if (isNameTaken) {
        throw new Error("User name is taken");
      }

      const password = await bcrypt.hash(data.password, 10);

      const user = await this.userRepo.create({
        name: data.name,
        email: data.email,
        password,
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      throw new Error();
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

      const token = await this.generateTokens(user);

      const newUser = await this.sanitizeUser(user);
      return {
        user: newUser,
        token,
      };
    } catch (error) {
      logger.error(error, "error login");
      throw new Error(error);
    }
  }

  async generateTokens(user: UserResponseDTO) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    logger.info(payload);
    //
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expire,
    });

    const refreshToken = jwt.sign({ userId: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expire,
    });

    return { accessToken, refreshToken };
  }

  async sanitizeUser(
    user: UserResponseDTO,
  ): Promise<Omit<UserResponseDTO, "password">> {
    const { password, ...rest } = user as UserResponseDTO;
    return rest;
  }
}
