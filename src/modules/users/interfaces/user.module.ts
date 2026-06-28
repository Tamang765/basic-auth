import appDataSource from "../../../database/database.js";
import { TokenService } from "../../../utils/jwt.js";
import { sessionRepo } from "../../sessions/Repositories/session.repository.js";
import { Sessions } from "../../sessions/sessions.entity.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserController } from "../user.controller.js";
import { User } from "../user.entity.js";
import { UserService } from "../user.service.js";

const userRepo = new UserRepository(appDataSource.getRepository(User));
const tokenService = new TokenService();
const sessionRepoInstance = new sessionRepo(
  appDataSource.getRepository(Sessions),
);

const userService = new UserService(
  userRepo,
  tokenService,
  sessionRepoInstance,
);

const userController = new UserController(userService);

export const UserModule = {
  controller: userController,
};
