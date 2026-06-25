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

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}



