import type { Repository } from "typeorm";
import type { User } from "../user.entity.js";

export class UserRepository {
  constructor(private repo: Repository<User>) {}
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findByUserName(name: string) {
    return this.repo.findOne({
      where: {
        name,
      },
    });
  }

  create(data: Partial<User>) {
    console.log("object");
    return this.repo.save(this.repo.create(data));
  }
}
