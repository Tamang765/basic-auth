import type { Repository } from "typeorm";
import { Sessions } from "../sessions.entity.js";

export class sessionRepo {
  constructor(private repo: Repository<Sessions>) {}
  create(data: Partial<Sessions>) {
    return this.repo.save(this.repo.create(data));
  }

  findBySessionId(sesionId: string) {
    return this.repo.findOne({
      where: {
        id: sesionId,
        isValid: true,
      },
    });
  }
  findByToken(token: string) {
    return this.repo.findOne({
      where: {
        refreshToken: token,
        isValid: true,
      },
    });
  }

  update(id: string, data: Partial<Sessions>) {
    return this.repo.update(id, data);
  }

  invalidate(userId: string) {
    return this.repo.update(userId, {
      isValid: false,
    });
  }

  invalidateOther(userId: string, sessionId: string) {
    return this.repo
      .createQueryBuilder()
      .update(Sessions)
      .set({ isValid: false })
      .where("userId =:userId", { userId })
      .andWhere("id != :sessionId", { sessionId })
      .execute();
  }
}
