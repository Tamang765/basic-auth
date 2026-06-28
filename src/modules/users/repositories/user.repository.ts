import type { Repository } from "typeorm";
import type { User } from "../user.entity.js";

export class UserRepository {
  constructor(private repo: Repository<User>) {}
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByUserName(name: string) {
    return this.repo.findOne({
      where: {
        name,
      },
    });
  }

  findByEmailToken(token: string) {
    return this.repo.findOne({
      where: {
        emailToken: token,
      },
    });
  }
  findByPassportToken(token: string) {
    return this.repo.findOne({
      where: {
        passwordRestToken: token,
      },
    });
  }

  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<User>) {
    return this.repo.update(id, data);
  }
}
