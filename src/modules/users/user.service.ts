import bcrypt from "bcryptjs";
import type { UserDTO } from "./dto/user-dto.js";
import { UserRepository } from "./repositories/user.repository.js";

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
}
