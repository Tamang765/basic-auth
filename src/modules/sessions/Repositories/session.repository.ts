import { Sessions } from "../sessions.entity.js";

export class sessionRepo {
  constructor(private repo: any) {}
  create(data: Partial<Sessions>) {
    return this.repo.save(this.repo.create(data));
  }

  findByUserId(userId: string) {
    return this.repo.find({
      where: {
        userId,
        isValid: true,
      },
    });
  }
  findByToken(token: string) {
    return this.repo.find({
      where: {
        refreshToken: token,
        isValid: true,
      },
    });
  }

  invalidate(userId: string) {
    return this.repo.update(userId, {
      isValid: false,
    });
  }
}
