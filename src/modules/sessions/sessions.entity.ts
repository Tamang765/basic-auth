import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity.js";

@Entity("sessions")
export class Sessions {
  @PrimaryGeneratedColumn("uuid")
  declare id: string;

  @Column("boolean", {
    default: false,
  })
  declare isValid: Boolean;

  @ManyToOne(() => User)
  declare user: User;

  @Column("varchar")
  declare userId: string;

  @Column("varchar", { length: 500 })
  declare refreshToken: string | null;
}
