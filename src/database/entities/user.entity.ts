import {
  // BeforeInsert,
  // BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
//import { compareValue, hashValue } from "../../utils/bcrypt";
import { Post } from "./post.entity";
import { Address } from "./address.entity";

export enum UserRole {
  USER = "ROLE_USER",
  ADMIN = "ROLE_ADMIN",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({
    type: "text",
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   if (this.password) {
  //     this.password = await hashValue(this.password);
  //   }
  // }

  // async comparePassword(candidatePassword: string): Promise<boolean> {
  //   return compareValue(candidatePassword, this.password);
  // }

  // omitPassword(): Omit<User, "password"> {
  //   const { password, ...userWithoutPassword } = this;
  //   return userWithoutPassword as Omit<User, "password">;
  // }
}
