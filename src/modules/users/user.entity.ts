import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  declare id: string;

  @Column("varchar", { length: 50 })
  declare name: string;

  @Column("varchar", { length: 100, unique: true })
  declare email: string;

  @Column("varchar", { length: 100 })
  declare password: string;

  @Column("bool", { default: false })
  declare isVerified: boolean;

  @Column("varchar", { nullable: true })
  declare emailToken: string | null;

  @Column("date", { nullable: true })
  declare emailTokenExpiresAt: Date | null;

  @Column("varchar", { nullable: true })
  declare passwordRestToken: string | null;

  @Column("date", { nullable: true })
  declare passwordRestTokenExpiresAt: Date | null;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
