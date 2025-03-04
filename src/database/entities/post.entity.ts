import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 250 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  user: User;
}
