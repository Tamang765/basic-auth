import appDataSource from "../../../database/database.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserController } from "../user.controller.js";
import { User } from "../user.entity.js";
import { UserService } from "../user.service.js";

const userRepo = new UserRepository(appDataSource.getRepository(User));

const userService = new UserService(userRepo);

const userController = new UserController(userService);

export const UserModule = {
  controller: userController,
};
