import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { User } from "./user.entity";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 25 })
  houseNumber: string;

  @Column({ type: "varchar", length: 255 })
  street: string;

  @Column({ type: "varchar", length: 100 })
  city: string;

  @Column({ type: "varchar", length: 100 })
  state: string;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
  user: User;
}
